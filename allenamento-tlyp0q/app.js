// Shared helpers of the practice pages: rabbit, grading, and the results queue.
// The link given to the iPad carries #k=<key>&n=<name>. The key lets /api/allenamento accept the
// results; the name is only used for the greeting. Both are kept in localStorage and in the URL
// hash (iOS "Add to Home Screen" keeps the hash, and a home-screen app has its own storage).
(function () {
  const API = "/api/allenamento";
  const QKEY = "allen-queue";

  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } }

  const hash = new URLSearchParams(location.hash.slice(1));
  if (hash.get("k")) lsSet("allen-key", hash.get("k"));
  if (hash.get("n")) lsSet("allen-name", hash.get("n"));

  function key() { return lsGet("allen-key") || ""; }
  function name() { return lsGet("allen-name") || ""; }
  // the hash to carry on links between pages, so the key is never lost
  function carry() {
    const p = new URLSearchParams();
    if (key()) p.set("k", key());
    if (name()) p.set("n", name());
    const s = p.toString();
    return s ? "#" + s : "";
  }

  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
  // tablets type a curly apostrophe: treat it like the straight one
  function clean(s) { return String(s).trim().toLowerCase().replace(/[‘’´`]/g, "'").replace(/\s+/g, " ").replace(/[.,;!?]+$/, ""); }
  function dist(a, b) {
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
  }
  // 1 = right, 0.5 = one letter off (two for long words), 0 = wrong
  function grade(typed, accepted) {
    const t = clean(typed);
    if (!t) return 0;
    if (accepted.includes(t)) return 1;
    if (accepted.some(a => a.length >= 4 && dist(t, a) <= (a.length >= 9 ? 2 : 1))) return 0.5;
    return 0;
  }
  function fmt(n) { return String(n).replace(".", ","); }

  function bunny(cls) {
    const f = "fill:var(--bun-fur);stroke:var(--bun-line);stroke-width:3";
    return `<svg class="bunny ${cls || ""}" viewBox="0 0 100 100" aria-hidden="true">
      <ellipse cx="36" cy="22" rx="8" ry="21" style="${f}" transform="rotate(-12 36 22)"/>
      <ellipse cx="36" cy="24" rx="3.5" ry="14" style="fill:var(--bun-pink)" transform="rotate(-12 36 24)"/>
      <ellipse cx="62" cy="22" rx="8" ry="21" style="${f}" transform="rotate(12 62 22)"/>
      <ellipse cx="62" cy="24" rx="3.5" ry="14" style="fill:var(--bun-pink)" transform="rotate(12 62 24)"/>
      <ellipse cx="50" cy="82" rx="27" ry="16" style="${f}"/>
      <circle cx="50" cy="57" r="22" style="${f}"/>
      <circle cx="42" cy="53" r="3.6" style="fill:var(--bun-line)"/>
      <circle cx="58" cy="53" r="3.6" style="fill:var(--bun-line)"/>
      <circle cx="43.3" cy="51.7" r="1.2" style="fill:#fff"/>
      <circle cx="59.3" cy="51.7" r="1.2" style="fill:#fff"/>
      <ellipse cx="34" cy="62" rx="5" ry="3.5" style="fill:var(--bun-cheek)"/>
      <ellipse cx="66" cy="62" rx="5" ry="3.5" style="fill:var(--bun-cheek)"/>
      <path d="M47.5 59 L52.5 59 L50 62 Z" style="fill:var(--bun-mouth)"/>
      <path d="M40 64 Q50 77 60 64 Z" style="fill:var(--bun-mouth);stroke:var(--bun-line);stroke-width:2;stroke-linejoin:round"/>
      <path d="M45 70 Q50 67.5 55 70 Q50 74 45 70 Z" style="fill:var(--bun-pink)"/>
    </svg>`;
  }

  function uid() { return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8); }
  function queue() { try { return JSON.parse(lsGet(QKEY) || "[]"); } catch (e) { return []; } }
  function saveQueue(q) { lsSet(QKEY, JSON.stringify(q.slice(-50))); }

  let flushing = false;
  let refused = false;   // the server said the key is wrong: keep the results, show it
  async function flush() {
    if (flushing || !key()) return status();
    flushing = true;
    let q = queue();
    for (const r of [...q]) {
      try {
        const res = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...r, key: key() }) });
        // 2xx = saved. 403 = wrong key: keep everything, a new link will send it.
        // Other 4xx = bad data, it will never be accepted: drop it. 5xx = try again later.
        if (res.status === 403) { refused = true; break; }
        refused = false;
        if (res.ok || (res.status >= 400 && res.status < 500)) q = q.filter(x => x.id !== r.id);
        else break;
      } catch (e) { break; } // offline: try again later
    }
    saveQueue(q);
    flushing = false;
    status();
  }
  function status() {
    const el = document.getElementById("sync");
    if (!el) return;
    const n = queue().length;
    el.textContent = !key() ? "Results saved only on this iPad."
      : refused ? `${n} result(s) not sent: this link is not the right one. Ask Dad for the link.`
      : n ? `${n} result(s) waiting for the internet.` : "Results sent. Well done!";
  }

  // result: { exercise, title, mode, startedAt, score, max, parts, items }
  function send(result) {
    const r = { v: 1, id: uid(), finishedAt: new Date().toISOString(), name: name() || undefined,
      device: { w: innerWidth, h: innerHeight, standalone: !!navigator.standalone }, ...result };
    const q = queue(); q.push(r); saveQueue(q);
    best(result.exercise, result.mode === "full" ? result.score : null, result.max);
    flush();
  }

  // best score and last date per exercise, for the list page
  function best(ex, score, max) {
    let all = {};
    try { all = JSON.parse(lsGet("allen-best") || "{}"); } catch (e) { all = {}; }
    const cur = all[ex] || {};
    if (score != null && (cur.score == null || score > cur.score)) { cur.score = score; cur.max = max; }
    cur.last = new Date().toISOString().slice(0, 10);
    cur.times = (cur.times || 0) + (score != null ? 1 : 0);
    all[ex] = cur;
    lsSet("allen-best", JSON.stringify(all));
  }
  function bests() { try { return JSON.parse(lsGet("allen-best") || "{}"); } catch (e) { return {}; } }

  addEventListener("online", flush);
  addEventListener("load", flush);

  window.APP = { esc, clean, grade, fmt, bunny, send, flush, status, key, name, carry, bests };
})();
