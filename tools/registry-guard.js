/**
 * HBCE Registry Guard — fail-closed
 * - Validates registry/registry.json schema
 * - Enforces append-only semantics on PRs:
 *   head.entries must start with base.entries (same order, same objects)
 *   only appends are allowed (no edits, deletes, reorders)
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const REG_PATH = "registry/registry.json";

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
  // Reads file at git ref (commit SHA / branch) without checkout
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

function normalizeEntry(e) {
  return {
    nickname: (e && typeof e.nickname === "string") ? e.nickname : null,
    payload_sha256: (e && typeof e.payload_sha256 === "string") ? e.payload_sha256 : null,
    timestamp: (e && typeof e.timestamp === "string") ? e.timestamp : null
  };
}

function validateSchema(registry, label) {
  if (!registry || typeof registry !== "object") die(`[${label}] registry.json deve essere un oggetto JSON.`);
  if (!Array.isArray(registry.entries)) die(`[${label}] registry.json deve contenere "entries": []`);

  const seen = new Set();
  registry.entries.forEach((raw, idx) => {
    const e = normalizeEntry(raw);

    if (!e.nickname || e.nickname.trim().length < 2) {
      die(`[${label}] entries[${idx}] nickname mancante/troppo corto.`);
    }
    if (!isSha256(e.payload_sha256)) {
      die(`[${label}] entries[${idx}] payload_sha256 non valido (atteso sha256 hex lowercase 64).`);
    }
    if (!isIsoUtc(e.timestamp)) {
      die(`[${label}] entries[${idx}] timestamp non valido (atteso ISO UTC con Z).`);
    }

    // Unicità minima: stessa coppia nickname+hash non deve ripetersi
    const key = `${e.nickname.trim()}::${e.payload_sha256}`;
    if (seen.has(key)) {
      die(`[${label}] duplicato rilevato: nickname+hash già presente (entries[${idx}]).`);
    }
    seen.add(key);
  });

  return true;
}

function entriesEqual(a, b) {
  // strict equality on canonical fields
  return (
    a.nickname === b.nickname &&
    a.payload_sha256 === b.payload_sha256 &&
    a.timestamp === b.timestamp
  );
}

function enforceAppendOnly(baseRegistry, headRegistry) {
  const base = baseRegistry.entries.map(normalizeEntry);
  const head = headRegistry.entries.map(normalizeEntry);

  if (head.length < base.length) {
    die(`Append-only violato: HEAD ha meno entries di BASE (base=${base.length}, head=${head.length}).`);
  }

  // prefix must match exactly
  for (let i = 0; i < base.length; i++) {
    if (!entriesEqual(base[i], head[i])) {
      die(
        `Append-only violato: entry modificata o riordinata a index=${i}.\n` +
        `BASE: ${JSON.stringify(base[i])}\n` +
        `HEAD: ${JSON.stringify(head[i])}\n` +
        `Sono consentite solo aggiunte in coda.`
      );
    }
  }

  const appended = head.length - base.length;
  return appended;
}

function main() {
  const eventName = process.env.GITHUB_EVENT_NAME || "";
  const isPR = eventName === "pull_request";

  // Always validate current working file
  const headWorking = readWorkingJson(REG_PATH);
  validateSchema(headWorking, "HEAD");

  if (isPR) {
    const baseSha = process.env.PR_BASE_SHA;
    const headSha = process.env.PR_HEAD_SHA;

    if (!baseSha || !headSha) {
      die("PR_BASE_SHA / PR_HEAD_SHA mancanti. Workflow non sta leggendo l'evento PR correttamente.");
    }

    const baseReg = readJsonAtRef(baseSha, REG_PATH);
    validateSchema(baseReg, "BASE");

    // enforce append-only comparing BASE vs current HEAD file (working tree)
    const appended = enforceAppendOnly(baseReg, headWorking);

    ok(`Append-only OK. Entries base=${baseReg.entries.length}, head=${headWorking.entries.length}, appended=${appended}.`);
    return;
  }

  // On push to main: schema only (append-only already enforced by PR guard)
  ok(`Schema OK su ${REG_PATH}. entries=${headWorking.entries.length}.`);
}

main();
