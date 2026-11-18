// API of the hidden family advent calendar (/avvento-6f6be7/).
// Nothing personal lives in this public repo: the story, the puzzles and the hiding places are
// uploaded from the owner's Mac into the Netlify Blobs store "avvento" (key content.json) with
// the Netlify CLI; the page is an empty shell that asks this function for them.
//
// GET  /api/avvento            -> { today, days: {<n>: day}, progress: {<n>: {...}} }
//                                 only the days already open in Rome time (1-24 December).
// POST /api/avvento {day, event: "solved"|"found", nickname?}
//                              -> records progress in progress/<day>.json (child key only).
//
// Two keys, both in the link hash (#k=…), never in the repo:
//   AVVENTO_KEY         the child's link
//   AVVENTO_PARENT_KEY  the parent's link: may ask for any date with ?oggi=YYYY-MM-DD to
//                       preview, and its events are never recorded.

import { getStore } from '@netlify/blobs';
import { timingSafeEqual } from 'node:crypto';

const YEAR = 2026;
const noStore = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' };

function sameKey(given, expected) {
  if (!expected) return false;
  const a = Buffer.from(String(given || ''));
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

// Date in Europe/Rome as YYYY-MM-DD.
export function romeDate(now) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(now);
}

// How many boxes are open on a given date: 0 before 1 December, 24 from Christmas Eve on.
export function openDays(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number);
  if (y < YEAR || (y === YEAR && m < 12)) return 0;
  if (y > YEAR) return 24;
  return Math.min(d, 24);
}

export async function handle(req, { store, env, now = new Date() }) {
  const key = req.headers.get('x-avvento-key');
  const isParent = sameKey(key, env.AVVENTO_PARENT_KEY);
  const isChild = !isParent && sameKey(key, env.AVVENTO_KEY);
  if (!env.AVVENTO_KEY) {
    return Response.json({ error: 'Not configured' }, { status: 500, headers: noStore });
  }
  if (!isParent && !isChild) {
    return Response.json({ error: 'Forbidden' }, { status: 403, headers: noStore });
  }

  if (req.method === 'GET') {
    let today = romeDate(now);
    const asked = new URL(req.url).searchParams.get('oggi');
    if (isParent && asked && /^\d{4}-\d{2}-\d{2}$/.test(asked)) today = asked;
    const content = await store.get('content.json', { type: 'json' });
    if (!content) {
      return Response.json({ error: 'No content' }, { status: 503, headers: noStore });
    }
    const open = openDays(today);
    const days = {};
    for (let n = 1; n <= open; n++) {
      if (content.days && content.days[n]) days[n] = content.days[n];
    }
    const progress = {};
    const { blobs } = await store.list({ prefix: 'progress/' });
    await Promise.all(blobs.map(async (b) => {
      const m = b.key.match(/^progress\/(\d{1,2})\.json$/);
      if (m) progress[m[1]] = await store.get(b.key, { type: 'json' });
    }));
    return Response.json({
      today, parent: isParent, title: content.title, cases: content.cases,
      start: `${YEAR}-12-01`, days, progress,
    }, { headers: noStore });
  }

  if (req.method === 'POST') {
    let data;
    try {
      const raw = await req.text();
      if (raw.length > 4096) throw new Error('too large');
      data = JSON.parse(raw);
    } catch {
      return Response.json({ error: 'Bad JSON' }, { status: 400, headers: noStore });
    }
    const day = Number(data && data.day);
    if (!Number.isInteger(day) || day < 1 || day > 24) {
      return Response.json({ error: 'Bad day' }, { status: 400, headers: noStore });
    }
    if (day > openDays(romeDate(now)) && !isParent) {
      return Response.json({ error: 'Not open yet' }, { status: 403, headers: noStore });
    }
    if (data.event !== 'solved' && data.event !== 'found') {
      return Response.json({ error: 'Bad event' }, { status: 400, headers: noStore });
    }
    // The parent's preview never touches the child's progress.
    if (isParent) return Response.json({ ok: true, recorded: false }, { headers: noStore });

    const k = `progress/${day}.json`;
    const prev = (await store.get(k, { type: 'json' })) || {};
    const at = now.toISOString();
    if (data.event === 'solved' && !prev.solvedAt) prev.solvedAt = at;
    if (data.event === 'found' && !prev.foundAt) prev.foundAt = at;
    if (typeof data.nickname === 'string') prev.nickname = data.nickname.slice(0, 30);
    await store.setJSON(k, prev);
    return Response.json({ ok: true, recorded: true }, { headers: noStore });
  }

  return new Response('Method Not Allowed', { status: 405, headers: noStore });
}

export default async (req) => handle(req, {
  store: getStore({ name: 'avvento', consistency: 'strong' }),
  env: process.env,
});

export const config = { path: '/api/avvento' };
