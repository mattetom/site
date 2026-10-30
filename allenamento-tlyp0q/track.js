// Results for the pages made before the shared engine (tests, games and quizzes imported from the
// scuola-margherita repo). Those engines are not changed: this script watches the classes they put
// on the answers and sends one result per finished run through APP.send (app.js).
//   tests/exercises: .fill.ok|.half|.no (input + .fix), .item.ok|.no (pressed button, .why)
//   quizzes/games:   .opt.right / .opt.wrong inside .opts, question in .q
//   end of a run:    an element .big with "X / Y"
// The page id comes from <html data-exercise="...">, set by strumenti/pubblica_allenamento.py.
(function () {
  const EX = document.documentElement.dataset.exercise;
  if (!EX || !window.APP) return;
  const SUBJECT = document.documentElement.dataset.subject || "";
  let items = [];
  let fullMax = 0;
  let startedAt = new Date().toISOString();
  const done = new WeakSet();
  const txt = el => (el ? el.textContent : "").replace(/\s+/g, " ").trim();

  function section(el) {
    const c = el.closest(".card, main, section, body");
    const h = c && c.querySelector(".ex-head b, .ex-head strong, h2");
    return txt(h) || document.title;
  }
  // the sentence around a blank, with every blank shown as ___
  function context(el, blankEl) {
    const host = blankEl.closest(".sent, .item, li, p") || blankEl.parentElement;
    const clone = host.cloneNode(true);
    clone.querySelectorAll(".fill, .fix").forEach(f => f.replaceWith(f.classList && f.classList.contains("fill") ? "___" : ""));
    return txt(clone).slice(0, 200);
  }
  function add(it) { items.push({ q: items.length + 1, tags: SUBJECT ? [SUBJECT] : [], mode: "full", ...it }); }

  function onFill(f) {
    const inp = f.querySelector("input");
    const pre = txt(f.querySelector(".pre"));
    const given = pre + (inp ? inp.value.trim() : "");
    const score = f.classList.contains("ok") ? 1 : f.classList.contains("half") ? 0.5 : 0;
    const fix = f.querySelector(".fix") || (f.nextElementSibling && f.nextElementSibling.classList.contains("fix") ? f.nextElementSibling : null);
    add({ part: section(f), skill: section(f), expected: score === 1 ? given : txt(fix) || "?", given, score, context: context(f, f) });
  }
  function onItem(it) {
    const q = txt(it.querySelector("p")) || txt(it).slice(0, 120);
    const pressed = it.querySelector('[aria-pressed="true"], .sel, .on');
    const ok = it.classList.contains("ok");
    add({ part: section(it), skill: section(it), expected: ok ? txt(pressed) : txt(it.querySelector(".why")).slice(0, 160) || "?", given: txt(pressed), score: ok ? 1 : 0, context: q.slice(0, 200) });
  }
  function onOpts(box) {
    const right = [...box.querySelectorAll(".opt.right")].map(o => o.dataset.v || txt(o));
    const wrong = [...box.querySelectorAll(".opt.wrong")].map(o => o.dataset.v || txt(o));
    const card = box.closest(".card, main, body");
    add({ part: section(box), skill: section(box), expected: right.join(" + "), given: wrong.length ? wrong.join(" + ") : right.join(" + "), score: wrong.length ? 0 : 1, context: txt(card && card.querySelector(".q")).slice(0, 200) });
  }
  function onBig(b) {
    const m = txt(b).match(/([\d.,]+)\s*\/\s*(\d+)/);
    if (!m) return;
    const max = Number(m[2]);
    // a run with fewer points than the first full run is a "redo only the wrong ones"
    if (!fullMax || max >= fullMax) fullMax = max;
    const mode = max < fullMax ? "redo" : "full";
    APP.send({ exercise: EX, title: document.title, mode, startedAt,
      score: Number(m[1].replace(",", ".")), max, parts: [], items: items.map(i => ({ ...i, mode })) });
    items = [];
    startedAt = new Date().toISOString();
  }

  const pendingOpts = new Set();
  function scan() {
    document.querySelectorAll(".fill.ok, .fill.half, .fill.no").forEach(f => { if (!done.has(f)) { done.add(f); onFill(f); } });
    document.querySelectorAll(".item.ok, .item.no").forEach(f => { if (!done.has(f)) { done.add(f); onItem(f); } });
    document.querySelectorAll(".opt.right").forEach(o => { const box = o.closest(".opts") || o.parentElement; if (!done.has(box)) pendingOpts.add(box); });
    pendingOpts.forEach(box => { done.add(box); onOpts(box); });
    pendingOpts.clear();
    document.querySelectorAll(".big").forEach(b => { if (!done.has(b)) { done.add(b); onBig(b); } });
  }
  // engines add "right" and then "wrong" in the same tick: scan after the DOM settles
  let t = null;
  new MutationObserver(() => { clearTimeout(t); t = setTimeout(scan, 60); })
    .observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["class"] });
})();
