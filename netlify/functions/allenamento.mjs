// Salva i risultati degli esercizi della sezione /allenamento-tlyp0q/ (pagine non linkate).
// Ogni esercizio finito arriva qui come JSON e finisce nello store Netlify Blobs "allenamento",
// una chiave per invio: results/AAAA-MM-GG/<ora>-<esercizio>-<random>.json.
// Si leggono dalla CLI: netlify blobs:list allenamento / netlify blobs:get allenamento <chiave>.
// Accetta solo invii con la chiave giusta (env var ALLENAMENTO_KEY su Netlify): la chiave sta nel
// link dato all'iPad, dopo il #, quindi non e nel repo.

import { getStore } from '@netlify/blobs';

const MAX_BYTES = 64 * 1024;

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const expected = process.env.ALLENAMENTO_KEY;
  if (!expected) {
    return Response.json({ error: 'Not configured' }, { status: 500 });
  }

  const raw = await req.text();
  if (raw.length > MAX_BYTES) {
    return Response.json({ error: 'Too large' }, { status: 413 });
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return Response.json({ error: 'Bad JSON' }, { status: 400 });
  }

  if (!data || data.key !== expected) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  if (typeof data.exercise !== 'string' || !/^[a-z0-9-]{1,60}$/.test(data.exercise)) {
    return Response.json({ error: 'Bad exercise id' }, { status: 400 });
  }
  if (!Array.isArray(data.items)) {
    return Response.json({ error: 'Missing items' }, { status: 400 });
  }

  delete data.key;
  const now = new Date();
  data.receivedAt = now.toISOString();

  // id stabile generato sul dispositivo: se l'iPad rimanda lo stesso invio, si sovrascrive
  const sid = typeof data.id === 'string' && /^[a-z0-9-]{8,40}$/.test(data.id)
    ? data.id
    : Math.random().toString(36).slice(2, 10);
  const day = (data.finishedAt || now.toISOString()).slice(0, 10).replace(/[^0-9-]/g, '');
  const key = `results/${day}/${data.exercise}-${sid}.json`;

  const store = getStore({ name: 'allenamento', consistency: 'strong' });
  await store.setJSON(key, data);

  return Response.json({ ok: true, key });
};

export const config = { path: '/api/allenamento' };
