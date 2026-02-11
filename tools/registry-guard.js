/**
 * HBCE Registry Guard — fail-closed + metrological time rules (HARD)
 * - Validates registry/registry.json schema
 * - Enforces append-only semantics on PRs
 * - Enforces time monotonicity (non-decreasing timestamps)
 * - Enforces future drift guard (10 min)
 * - Enforces realtime issuance window for appended entries (±2 min vs CI time)
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const REG_PATH = "registry/registry.json";

const FUTURE_DRIFT_MS = 10 * 60 * 1000; // 10 minutes
const REALTIME_WINDOW_MS = 2 * 60 * 1000; // ±2 minutes for appended entries

function die(msg) {
  console.error("\n[REGISTRY-GUARD] BLOCKED ❌");
  console.error(msg);
  process.exit(1);
}

function ok(msg) {
  console.log("\n[REGISTRY-GUARD] PASS ✅");
  console.log(msg);
}

function readJsonAtRef(ref, filePath) {
  try {
    const out = execSync(`git show ${ref}:${filePath}`, { stdio: ["ignore", "pipe", "pipe"] }).toString("utf8");
    return JSON.parse(out);
  } catch (e) {
    die(`Impossibile leggere ${filePath} a ref=${ref}. Dettagli: ${String(e.message || e)}`);
  }
}

function readWorkingJson(filePath) {
  const abs = path.join(process.cwd(), filePath);
  if (!fs.existsSync(abs)) die(`File mancante: ${filePath}`);
  try {
    return JSON.parse(fs.readFileSync(abs, "utf8"));
  } catch (e) {
    die(`JSON invalido: ${filePath}. Errore: ${String(e.message || e)}`);
  }
}

function isIsoUtc(ts) {
  return typeof ts === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/.test(ts);
}

function isSha256(h) {
  return typeof h === "string" && /^[a-f0-9]{64}$/.test(h);
}

function parseUtc(ts) {
  const t = Date.parse(ts);
  if (Number.isNaN(t)) return null;
  return t;
}

function normalizeEntry(e) {
  return {
    nickname: (e && typeof e.nickname === "string") ? e.nickname.trim() : null,
    payload_sha256: (e && typeof e.payload_sha256 === "string") ? e.payload_sha256 : null,
    timestamp: (e && typeof e.timestamp === "string") ? e.timestamp : null
  };
}

function validateSchema(registry, label) {
  if (!registry || typeof registry !== "object") die(`[${label}] registry.json deve essere un oggetto JSON.`);
  if (!Array.isArray(registry.entries)) die(`[${label}] registry.json deve contenere "entries": []`);

  const seen = new Set();
  let prevTime = null;

  registry.entries.forEach((raw, idx) => {
    const e = normalizeEntry(raw);

    if (!e.nickname || e.nickname.length < 2) die(`[${label}] entries[${idx}] nickname mancante/troppo corto.`);
    if (!isSha256(e.payload_sha256)) die(`[${label}] entries[${idx}] payload_sha256 non valido (sha256 hex 64 lowercase).`);
    if (!isIsoUtc(e.timestamp)) die(`[${label}] entries[${idx}] timestamp non valido (ISO UTC con Z).`);

    const t = parseUtc(e.timestamp);
    if (t === null) die(`[${label}] entries[${idx}] timestamp non parsabile.`);

    // monotonic timestamps across whole file
    if (prevTime !== null && t < prevTime) {
      die(
        `[${label}] ordine temporale violato: entries[${idx}] (${e.timestamp}) < entry precedente.\n` +
        `Regola: timestamp non-decrescenti.`
      );
    }
    prevTime = t;

    // future drift guard (soft)
    const now = Date.now();
    if (t > now + FUTURE_DRIFT_MS) {
      die(
        `[${label}] timestamp troppo nel futuro: entries[${idx}] (${e.timestamp}).\n` +
        `Tolleranza massima: ${Math.floor(FUTURE_DRIFT_MS / 60000)} minuti.`
      );
    }

    // uniqueness: nickname+hash must not repeat
    const key = `${e.nickname}::${e.payload_sha256}`;
    if (seen.has(key)) die(`[${label}] duplicato rilevato: nickname+hash già presente (entries[${idx}]).`);
    seen.add(key);
  });

  return true;
}

function entriesEqual(a, b) {
  return a.nickname === b.nickname && a.payload_sha256 === b.payload_sha256 && a.timestamp === b.timestamp;
}

function enforceAppendOnly(baseRegistry, headRegistry) {
  const base = baseRegistry.entries.map(normalizeEntry);
  const head = headRegistry.entries.map(normalizeEntry);

  if (head.length < base.length) die(`Append-only violato: HEAD < BASE (base=${base.length}, head=${head.length}).`);

  for (let i = 0; i < base.length; i++) {
    if (!entriesEqual(base[i], head[i])) {
      die(
        `Append-only violato: entry modificata/riordinata a index=${i}.\n` +
        `BASE: ${JSON.stringify(base[i])}\n` +
        `HEAD: ${JSON.stringify(head[i])}\n` +
        `Sono consentite solo aggiunte in coda.`
      );
    }
  }

  return head.slice(base.length);
}

function enforceAppendedTimeNotBeforeBaseLast(baseRegistry, appendedEntries) {
  const base = baseRegistry.entries.map(normalizeEntry);
  if (base.length === 0) return;

  const lastBase = base[base.length - 1];
  const lastBaseTime = parseUtc(lastBase.timestamp);

  appendedEntries.forEach((e, k) => {
    const t = parseUtc(e.timestamp);
    if (t === null) die(`Timestamp appended non parsabile: ${e.timestamp}`);
    if (t < lastBaseTime) {
      die(
        `Metrological rule violata: appended[${k}] (${e.timestamp}) < ultimo BASE (${lastBase.timestamp}).\n` +
        `Regola: nuove entry non possono retrodatare la sequenza.`
      );
    }
  });
}

function enforceRealtimeWindowForAppends(appendedEntries) {
  const now = Date.now();

  appendedEntries.forEach((e, k) => {
    const t = parseUtc(e.timestamp);
    if (t === null) die(`Timestamp appended non parsabile: ${e.timestamp}`);

    const delta = Math.abs(t - now);
    if (delta > REALTIME_WINDOW_MS) {
      die(
        `Realtime window violata: appended[${k}] timestamp (${e.timestamp}) è fuori finestra.\n` +
        `Regola HARD: |timestamp - now| <= ${Math.floor(REALTIME_WINDOW_MS / 60000)} minuti.\n` +
        `Questo impedisce retrodatazioni/postdatazioni sulle nuove entry.`
      );
    }
  });
}

function main() {
  const eventName = process.env.GITHUB_EVENT_NAME || "";
  const isPR = eventName === "pull_request";

  const headWorking = readWorkingJson(REG_PATH);
  validateSchema(headWorking, "HEAD");

  if (isPR) {
    const baseSha = process.env.PR_BASE_SHA;
    const headSha = process.env.PR_HEAD_SHA;
    if (!baseSha || !headSha) die("PR_BASE_SHA / PR_HEAD_SHA mancanti.");

    const baseReg = readJsonAtRef(baseSha, REG_PATH);
    validateSchema(baseReg, "BASE");

    const appended = enforceAppendOnly(baseReg, headWorking);
    enforceAppendedTimeNotBeforeBaseLast(baseReg, appended);
    enforceRealtimeWindowForAppends(appended);

    ok(`Append-only OK + monotonic time OK + realtime window OK. appended=${appended.length}.`);
    return;
  }

  ok(`Schema OK + monotonic time OK su ${REG_PATH}. entries=${headWorking.entries.length}.`);
}

main();
