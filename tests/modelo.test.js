import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { filtrarItens } from '../src/utils/catalogo.js';
import { calcularPedido } from '../src/data/produtos.js';
import { requisitarJson } from '../src/services/http.js';
import { handleStripe } from '../server/stripe.js';

const itens = [
  { id: 1, nome: 'Água', categoria: 'A', numero: '20' },
  { id: 2, nome: 'Fogo', categoria: 'B', numero: '3' },
  { id: 3, nome: 'Ar', categoria: 'A', numero: '1' },
];
test('busca ignora acentos/caixa e combina categoria e favoritos', () => {
  assert.deepEqual(filtrarItens(itens, { busca: ' AGUA ', categoria: 'A', favoritos: [1] }).map((x) => x.id), [1]);
  assert.equal(filtrarItens(itens, { busca: 'agua', categoria: 'B' }).length, 0);
  assert.equal(filtrarItens(itens, { favoritos: [] }).length, 0);
});
test('ordenação numérica não altera array de origem', () => {
  assert.deepEqual(filtrarItens(itens, { ordem: 'numero' }).map((x) => x.id), [3, 2, 1]);
  assert.deepEqual(itens.map((x) => x.id), [1, 2, 3]);
});
test('pedido usa centavos e preços do catálogo mesmo com preço adulterado', () => {
  const pedido = calcularPedido([{ id: 'caderno', quantidade: 2, preco: 1 }, { id: 'caneca', quantidade: 1 }]);
  assert.equal(pedido.total, 8500);
  for (const invalido of [[], [{ id: 'x', quantidade: 1 }], [{ id: 'caderno', quantidade: -1 }], [{ id: 'caderno', quantidade: 1.5 }], [{ id: 'caneca', quantidade: 11 }], [{ id: 'caneca', quantidade: 1 }, { id: 'caneca', quantidade: 1 }]]) {
    assert.throws(() => calcularPedido(invalido));
  }
});
test('cliente HTTP distingue JSON válido, erro HTTP e HTML', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('{"id":25}', { headers: { 'content-type': 'application/json' } }));
  assert.deepEqual(await requisitarJson('/api'), { id: 25 });
  globalThis.fetch = async () => new Response('{"message":"Não encontrado"}', { status: 404, headers: { 'content-type': 'application/json' } });
  await assert.rejects(requisitarJson('/api'), /Não encontrado/);
  globalThis.fetch = async () => new Response('<html></html>', { headers: { 'content-type': 'text/html' } });
  await assert.rejects(requisitarJson('/api'), /não é JSON/);
});
async function chamarBackend({ method = 'POST', body = '{}', key = 'sk_test_ficticia', fetchImpl } = {}) {
  const req = Readable.from([body]); req.method = method;
  const res = { setHeader() {}, end(texto) { this.dados = JSON.parse(texto); } };
  await handleStripe(req, res, { STRIPE_SECRET_KEY: key }, fetchImpl || (() => { throw new Error('A rede não deve ser usada neste caso'); }));
  return res;
}
test('backend rejeita método, ausência de chave e chave live antes de usar rede', async () => {
  assert.equal((await chamarBackend({ method: 'GET' })).statusCode, 405);
  assert.equal((await chamarBackend({ key: '' })).statusCode, 503);
  assert.equal((await chamarBackend({ key: 'sk_live_ficticia' })).statusCode, 503);
});
test('backend rejeita JSON inválido, corpo excessivo e carrinho adulterado', async () => {
  assert.equal((await chamarBackend({ body: '{' })).statusCode, 400);
  assert.equal((await chamarBackend({ body: 'a'.repeat(9000) })).statusCode, 400);
  assert.equal((await chamarBackend({ body: JSON.stringify({ itens: [{ id: 'produto-inexistente', quantidade: 1 }] }) })).statusCode, 400);
});
test('backend recalcula total e devolve somente contrato esperado', async () => {
  let enviado;
  const res = await chamarBackend({
    body: JSON.stringify({ total: 1, itens: [{ id: 'caneca', quantidade: 2 }] }),
    fetchImpl: async (url, options) => {
      enviado = { url, options };
      return new Response(JSON.stringify({ client_secret: 'pi_ficticio_secret_teste' }));
    },
  });
  assert.equal(res.statusCode, 200);
  assert.equal(enviado.options.body.get('amount'), '7000');
  assert.equal(enviado.options.body.get('currency'), 'brl');
  assert.deepEqual(res.dados, { clientSecret: 'pi_ficticio_secret_teste', total: 7000 });
});
test('falhas da Stripe viram erro tratável na interface', async () => {
  const body = JSON.stringify({ itens: [{ id: 'caderno', quantidade: 1 }] });
  const res = await chamarBackend({ body, fetchImpl: async () => new Response('{"error":{"message":"Chave inválida"}}', { status: 401 }) });
  assert.equal(res.statusCode, 502);
  assert.equal(res.dados.message, 'Chave inválida');
  assert.equal((await chamarBackend({ body, fetchImpl: async () => { throw new Error('offline'); } })).statusCode, 502);
});
