# Stripe opcional: roteiro de teste

O carrinho e o botão **Simular pedido** funcionam sem Stripe. Não usam cartão, conta ou dinheiro. O exemplo de integração real está pronto para usar **chaves de teste**, mas precisa ser configurado na sua conta. Nenhuma credencial foi incluída neste repositório.

1. Copie `.env.example` para `.env.local`.
2. Na sua conta de teste Stripe, obtenha a chave publicável `pk_test_...` e a secreta `sk_test_...` do mesmo ambiente.
3. Preencha `VITE_STRIPE_PUBLISHABLE_KEY` e `STRIPE_SECRET_KEY`.
4. Reinicie `npm run dev`. Edite o carrinho e clique em **Abrir Stripe de teste**.
5. Use somente dados de teste da [documentação oficial](https://docs.stripe.com/testing). Para aprovação básica: `4242 4242 4242 4242`, validade futura e CVC de teste de três dígitos. Nunca use cartão real.
6. Clique em **Confirmar pagamento de teste** e confira a mensagem e o painel de teste Stripe.

## Fluxo para memorizar

```text
Carrinho: IDs + quantidades
  → POST /api/stripe (middleware Node no Vite)
  → servidor valida catálogo e calcula total em centavos
  → Stripe cria PaymentIntent com chave sk_test_
  → navegador recebe clientSecret desse pagamento
  → Elements + PaymentElement montam formulário seguro
  → stripe.confirmPayment confirma o pagamento de teste
```

`clientSecret` de um PaymentIntent é diferente da chave secreta de API. Não registre nem compartilhe esse segredo do pagamento. `VITE_*` é público; `STRIPE_SECRET_KEY` só é lida por `vite.config.js` e pelo handler no servidor. O handler rejeita qualquer chave que não comece por `sk_test_`. O botão só habilita quando a chave pública começa por `pk_test_`.

O catálogo compartilhado entre cliente e servidor é aceitável para este exercício; o servidor sempre recalcula o valor e rejeita produtos desconhecidos, duplicados e quantidades fora de 1–10. Em uma aplicação real, preços vêm da fonte confiável do servidor/banco. O serviço local demonstra apenas criação e confirmação de pagamentos com cartão, com `redirect: 'if_required'`. Métodos que redirecionam e consulta após retorno precisam de tratamento adicional, como no projeto do professor.

## Limites e verificação

Os testes automatizados usam uma função Stripe simulada; não comprovam autorização com sua conta nem um pagamento ponta a ponta. O build e o fluxo de pedido simulado são verificáveis sem chaves. A API deste exemplo só funciona com `npm run dev` e `npm run preview`; publicar apenas `dist` não cria backend. Não há deploy automático.

Antes de usar fora de um exercício, implementar autenticação/autorização, limites de requisição, idempotência, persistência de pedido e **webhook verificado no servidor** para confirmar a entrega. A mensagem no navegador não deve liberar um produto real por si só.

Referências: [React Stripe.js](https://docs.stripe.com/sdks/stripejs-react), [PaymentIntents](https://docs.stripe.com/payments/payment-intents), [projeto do professor](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/tree/main/PROJETOS/React/StripeAPI).
