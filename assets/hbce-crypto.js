const HBCE = (() => {
  const te = new TextEncoder();

  function toHex(buffer){
    const bytes = new Uint8Array(buffer);
    let out = "";
    for (const b of bytes) out += b.toString(16).padStart(2,"0");
    return out;
  }

  async function sha256String(str){
    const buf = await crypto.subtle.digest("SHA-256", te.encode(str));
    return toHex(buf);
  }

  async function sha256Json(obj){
    // Canonicalize: stable stringify (keys sorted)
    const stable = stableStringify(obj);
    return sha256String(stable);
  }

  function stableStringify(value){
    if(value === null) return "null";
    const t = typeof value;
    if(t === "number" || t === "boolean") return String(value);
    if(t === "string") return JSON.stringify(value);
    if(Array.isArray(value)) return "[" + value.map(stableStringify).join(",") + "]";
    if(t === "object"){
      const keys = Object.keys(value).sort();
      return "{" + keys.map(k => JSON.stringify(k) + ":" + stableStringify(value[k])).join(",") + "}";
    }
    return JSON.stringify(String(value));
  }

  function nowISO(){
    return new Date().toISOString();
  }

  function download(filename, content, mime="application/json"){
    const blob = new Blob([content], {type:mime});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=>URL.revokeObjectURL(url), 1500);
  }

  async function fetchJson(url){
    const res = await fetch(url, {cache:"no-store"});
    if(!res.ok) throw new Error("HTTP "+res.status);
    return res.json();
  }

  return { sha256String, sha256Json, stableStringify, nowISO, download, fetchJson };
})();
