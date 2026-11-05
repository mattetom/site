// Read-only API for the hidden daily offers digest page (/offerte-79e16d/).
// The digests are built on the owner's Mac every morning and written straight into the
// Netlify Blobs store "offerte" with the Netlify CLI (no write endpoint here):
//   status.json            outcome of the last run (ok, or the error to show on the page)
//   days/YYYY-MM-DD.json   one digest per day
// Nothing personal lives in this public repo: the page is an empty shell that asks this
// function for the data, and the function answers only with the key carried in the link
// hash (env var OFFERTE_KEY on Netlify).

import { getStore } from '@netlify/blobs';
import { timingSafeEqual } from 'node:crypto';

const MAX_DAYS = 7;

function sameKey(given, expected) {
  const a = Buffer.from(String(given || ''));
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

const noStore = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' };

export default async (req) => {
  if (req.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 });
  }
  const expected = process.env.OFFERTE_KEY;
  if (!expected) {
    return Response.json({ error: 'Not configured' }, { status: 500, headers: noStore });
  }
  if (!sameKey(req.headers.get('x-offerte-key'), expected)) {
    return Response.json({ error: 'Forbidden' }, { status: 403, headers: noStore });
  }

  const store = getStore({ name: 'offerte', consistency: 'strong' });
  const status = await store.get('status.json', { type: 'json' });
  const { blobs } = await store.list({ prefix: 'days/' });
  const keys = blobs
    .map((b) => b.key)
    .filter((k) => /^days\/\d{4}-\d{2}-\d{2}\.json$/.test(k))
    .sort()
    .reverse()
    .slice(0, MAX_DAYS);
  const days = (await Promise.all(keys.map((k) => store.get(k, { type: 'json' })))).filter(Boolean);

  return Response.json({ status: status || null, days }, { headers: noStore });
};

export const config = { path: '/api/offerte' };
