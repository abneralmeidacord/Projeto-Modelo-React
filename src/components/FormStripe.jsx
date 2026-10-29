import { useState } from 'react';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';

export default function FormStripe() {
  const stripe = useStripe(); const elements = useElements();
  const [mensagem, setMensagem] = useState('');
  const [enviando, setEnviando] = useState(false);
  async function pagar(e) {
    e.preventDefault(); if (!stripe || !elements) return;
    setEnviando(true); setMensagem('');
    try {
      const resultado = await stripe.confirmPayment({
        elements, confirmParams: { return_url: `${window.location.origin}/pagamento` }, redirect: 'if_required',
      });
      setMensagem(resultado.error?.message || `Status de teste: ${resultado.paymentIntent?.status}`);
    } catch { setMensagem('Falha na confirmação. Verifique a conexão.'); }
    finally { setEnviando(false); }
  }
  return <form className="painel" onSubmit={pagar}><h3>Stripe em modo de teste</h3><PaymentElement />
    <button className="primario" disabled={!stripe || enviando}>{enviando ? 'Confirmando...' : 'Confirmar pagamento de teste'}</button>
    <p role="status">{mensagem}</p></form>;
}
