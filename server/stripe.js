import { calcularPedido } from '../src/data/produtos.js';

function responder(res, status, dados) {
  res.statusCode = status; res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store'); res.end(JSON.stringify(dados));
}
// Backend didático para npm run dev/preview. Não é uma API de produção.
export async function handleStripe(req, res, env, stripeFetch = fetch) {
  if (req.method !== 'POST') return responder(res, 405, { message: 'Use POST.' });
  const chave = env.STRIPE_SECRET_KEY || '';
  if (!chave.startsWith('sk_test_')) return responder(res, 503, { message: 'Configure uma chave sk_test_ no .env.local e reinicie o Vite.' });
  let pedido;
  try {
    let texto = '';
    for await (const parte of req) { texto += parte; if (texto.length > 8192) throw new Error('Pedido muito grande.'); }
    pedido = calcularPedido(JSON.parse(texto).itens);
  } catch (e) { return responder(res, 400, { message: e.message }); }
  try {
    const resposta = await stripeFetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: { Authorization: `Bearer ${chave}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ amount: String(pedido.total), currency: 'brl', 'payment_method_types[]': 'card' }),
      signal: AbortSignal.timeout(15000),
    });
    const dados = await resposta.json();
    if (!resposta.ok) return responder(res, 502, { message: dados.error?.message || 'Erro na Stripe.' });
    return responder(res, 200, { clientSecret: dados.client_secret, total: pedido.total });
  } catch { return responder(res, 502, { message: 'Não foi possível conectar à Stripe.' }); }
}
