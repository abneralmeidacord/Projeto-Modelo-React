# Adaptar ao enunciado

Comece identificando **entrada de dados, campos, filtros, ações e entrega**. Reaproveite só as partes necessárias. Nada neste modelo demonstra o tema da AV2.

## Se for lista com busca, filtros e cards

1. Troque `public/dados/itens.json` pelos dados pedidos.
2. Mantenha o formato interno ou ajuste o retorno em `src/services/dados.js`.
3. Troque os campos de `ItemCard.jsx`, do formulário e de `filtrarItens`.
4. Acrescente um `useState` ou parâmetro de URL para cada filtro.
5. Combine critérios com `&&`; filtro vazio deve aceitar todos.
6. Use IDs estáveis nas keys. Teste filtro isolado, filtros combinados e resultado vazio.

Exemplo de formato interno:

```js
const itens = dados.map((linha) => ({
  id: linha.SQ_CANDIDATO,
  nome: linha.NM_URNA_CANDIDATO,
  numero: linha.NR_CANDIDATO,
  categoria: linha.DS_CARGO,
  partido: linha.SG_PARTIDO,
  descricao: linha.DS_OCUPACAO,
}));
```

São nomes de campos usados em bases TSE; confira o cabeçalho do arquivo efetivamente fornecido. Para segundo filtro, crie `partido`, monte suas opções com `Set`, acrescente `(!partido || item.partido === partido)` na função e exiba no card. IDs do CSV podem ser strings; compare sempre tipos consistentes. `useParams` devolve string.

## Se vier CSV

Coloque o arquivo em `public/dados/base.csv`. Use `carregarCsv('/dados/base.csv', signal)` de `src/services/dados.js`, depois faça o `.map()` dos campos. Confira separador, cabeçalho, codificação e linhas vazias. Não use `split(';')`: um campo entre aspas pode conter o próprio separador. Se vier UTF-8, troque o `TextDecoder` para `'utf-8'`. O exemplo não inclui a base completa da AV1.

## Se for API

Use `ConsultaApi.jsx` como referência. Troque URL, parâmetro e JSX. Abra uma resposta JSON antes de mapear os campos. Não deixe a consulta em cada tecla se o enunciado pedir botão Buscar. Use `encodeURIComponent` em valores de rota e `URLSearchParams` em queries. Não confunda paginação local com paginação da API: se a API retorna 20 de 100 itens, um filtro local só examina aqueles 20.

Para detalhes em rota: adicione `/item/:id` em `App.jsx`, use `useParams` e busque pelo ID. Para detalhes simples na mesma página, reaproveite `detalhe` no catálogo. Para imagem, use `alt` e fallback em `onError`, evitando apontar o fallback para a mesma URL que falhou.

## Se for cadastro/login

Reaproveite `Conta`, `AuthContext`, `ProtectedRoute` e `usuarios`. Troque os campos do form e as regras. O exemplo é local, como a abordagem didática observada. Se o enunciado fornecer backend, `autenticar` deve chamar esse backend; senha nunca deve ir para sessão. Validação e autorização reais ficam no servidor. Para CAPTCHA/recuperação, consulte `EXTRAS.md` e o código do professor.

## Se for carrinho/pagamento

Troque `produtos.js`. Preserve valores em centavos. Leia `STRIPE.md`: o navegador envia **IDs e quantidades**, o servidor calcula o preço e cria PaymentIntent. Não coloque `STRIPE_SECRET_KEY` em arquivos React. Simulação não satisfaz um requisito explícito de integração real: configure as chaves de teste caso isso seja pedido.

## Se quiser reduzir o projeto

Para questão só de catálogo, basta a página Catálogo, ItemCard, dados/http, filtrarItens, hook de storage e estilos. Remova imports e rotas que não usar; remova também o middleware Stripe do Vite se excluir `server/stripe.js`. Você pode substituir o conteúdo de App por `<Catalogo />`; se mantiver `useSearchParams`, mantenha BrowserRouter em main. Não gaste tempo copiando telas não pedidas.
