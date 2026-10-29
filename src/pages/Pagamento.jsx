import { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { produtos, calcularPedido, moeda } from '../data/produtos.js';
import { requisitarJson } from '../services/http.js';
import FormStripe from '../components/FormStripe.jsx';

const chave = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
const stripePromise = chave.startsWith('pk_test_') ? loadStripe(chave) : null;

export default function Pagamento() {
  const [quantidades, setQuantidades] = useState({ caderno: 1, caneca: 0 });
  const [mensagem, setMensagem] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const itens = produtos.filter((p) => quantidades[p.id] > 0).map((p) => ({ id: p.id, quantidade: quantidades[p.id] }));
  const total = itens.length ? calcularPedido(itens).total : 0;
  async function iniciarStripe() {
    setEnviando(true); setMensagem('');
    try {
      const dados = await requisitarJson('/api/stripe', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ itens }),
      });
      setClientSecret(dados.clientSecret);
    } catch (e) { setMensagem(e.message); }
    finally { setEnviando(false); }
  }
  return <>
    <div className="titulo"><span className="selo">04 / CARRINHO E INTEGRAÇÃO</span><h2>Carrinho de estudo</h2><p>Treine quantidades, reduce e requisições POST. A simulação funciona sem conta Stripe.</p></div>
    <section className="painel">{produtos.map((produto) => <div className="linha produto" key={produto.id}>
      <span>{produto.nome} · {moeda(produto.preco)}</span><label>Quantidade de {produto.nome}<input type="number" min="0" max="10" step="1" value={quantidades[produto.id]} disabled={Boolean(clientSecret) || enviando}
        onChange={(e) => { const n = Number(e.target.value); setMensagem(''); setQuantidades({ ...quantidades, [produto.id]: Number.isFinite(n) ? Math.min(10, Math.max(0, Math.trunc(n))) : 0 }); }} /></label>
    </div>)}<h3>Total: {moeda(total)}</h3>
      <div className="acoes"><button className="primario" disabled={!itens.length || Boolean(clientSecret) || enviando} onClick={() => setMensagem('Pedido simulado com sucesso. Nenhum pagamento foi criado.')}>Simular pedido</button>
        <button disabled={!stripePromise || !itens.length || enviando || Boolean(clientSecret)} onClick={iniciarStripe}>{enviando ? 'Criando...' : 'Abrir Stripe de teste'}</button>
        {clientSecret && <button onClick={() => { setClientSecret(''); setMensagem(''); }}>Voltar ao carrinho</button>}</div>
      {!stripePromise && <p>A integração opcional usa as duas chaves de teste do .env.example. Veja docs/STRIPE.md.</p>}
      <p role="status">{mensagem}</p>
    </section>
    {clientSecret && <Elements stripe={stripePromise} options={{ clientSecret, locale: 'pt-BR' }}><FormStripe /></Elements>}
  </>;
}
