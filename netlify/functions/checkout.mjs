// Crea una Stripe Checkout Session (subscription mensile) per i piani Regestio.
// I prezzi vivono qui, non nel catalogo Stripe: price_data inline a ogni sessione.
// Richiede la env var STRIPE_SECRET_KEY configurata su Netlify (Site settings → Environment variables).

const PLANS = {
  small:  { name: 'Regestio Small — fino a 300 soci',    amount: 9900 },
  medium: { name: 'Regestio Medium — fino a 1.000 soci', amount: 29900 },
  large:  { name: 'Regestio Large — fino a 2.000 soci',  amount: 49900 },
};

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return Response.json({ error: 'Pagamenti non ancora configurati' }, { status: 500 });
  }

  let plan;
  try {
    ({ plan } = await req.json());
  } catch {
    return Response.json({ error: 'Richiesta non valida' }, { status: 400 });
  }

  const selected = PLANS[plan];
  if (!selected) {
    return Response.json({ error: 'Piano sconosciuto' }, { status: 400 });
  }

  const origin = new URL(req.url).origin;
  const landing = `${origin}/regestio/`;

  const body = new URLSearchParams({
    mode: 'subscription',
    locale: 'it',
    'line_items[0][quantity]': '1',
    'line_items[0][price_data][currency]': 'eur',
    'line_items[0][price_data][unit_amount]': String(selected.amount),
    'line_items[0][price_data][recurring][interval]': 'month',
    'line_items[0][price_data][product_data][name]': selected.name,
    success_url: `${landing}?checkout=success`,
    cancel_url: `${landing}?checkout=cancel#prezzi`,
    billing_address_collection: 'required',
    'tax_id_collection[enabled]': 'true',
    'metadata[plan]': plan,
    'subscription_data[metadata][plan]': plan,
  });

  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  const session = await res.json();
  if (!res.ok) {
    console.error('Stripe error:', session.error?.message);
    return Response.json({ error: 'Errore nella creazione del pagamento' }, { status: 502 });
  }

  return Response.json({ url: session.url });
};

export const config = { path: '/api/checkout' };
