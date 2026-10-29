# O que revisar a partir dos repositórios

Análise feita em 28/10/2026. Os repositórios podem mudar. **Não há enunciado da AV2 disponível aqui**, portanto os tópicos abaixo são uma orientação de estudo, não uma previsão do que vai cair.

## O que o quadro informa

Segunda avaliação de DIAW em 29/10; 25 pontos; individual; com consulta ao GitHub. Estudar `PROJETOS/React`. Comandos: `npm create vite@latest -- --template react`, `npm install`, `npm run dev`; endereço local na porta 5173. O print é referência da orientação da disciplina, não uma especificação de implementação da prova.

## Projetos efetivamente consultados

| Referência | O que o código faz | O que este modelo aproveita como padrão |
| --- | --- | --- |
| [Pokedex](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/tree/main/PROJETOS/React/Pokedex) | `pokedexService` importa JSON local; modela Pokémon/tipos/treinadores; busca por nome/número; filtro por tipo; ordenação; detalhes; favoritos via Supabase. | Catálogo em JSON, `filter`, `sort`, props, detalhes e favoritos. Aqui favoritos são locais. A tela PokéAPI é um exemplo adicional de HTTP. |
| [StripeAPI](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/tree/main/PROJETOS/React/StripeAPI) | Carrinho, total, formulário Stripe, PaymentIntent via `/api/stripe`, consulta de status, chaves separadas entre cliente/servidor. Middleware no Vite e função na Vercel. | Carrinho pequeno, centavos, POST, PaymentElement e servidor de teste opcional. |
| [StripeAPI_2](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/tree/main/PROJETOS/React/StripeAPI_2) | A árvore acrescenta carteira (`Wallet`/`TestWallet`) e mantém carrinho, serviço e backend de pagamentos. | Não reproduzimos carteira: foco na lógica comum de pedido e integração. A implementação foi aprofundada no StripeAPI. |
| [SecureLoginPUC_React](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/tree/main/PROJETOS/React/SecureLoginPUC_React) | React Router; cadastro; login; contexto de sessão; rota protegida; hash local SHA-256; recuperação com token/expiração e envio de e-mail; reCAPTCHA. | Cadastro/login local, Context, sessão sem senha e ProtectedRoute. Extras documentados separadamente. |
| [CandidatosTSE_React](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/tree/main/PROJETOS/React/CandidatosTSE_React) | CSV, hook de carregamento, filtros na URL, cards, contagem, erro e estado vazio. `App` corresponde ao controller + template do Spring. | Carregamento assíncrono, filtros com URLSearchParams e leitor CSV opcional com Papa Parse. |
| [Sua AV1-DIAW](https://github.com/abneralmeidacord/AV1-DIAW) | Spring Boot + Thymeleaf + OpenCSV; controller recebe cargo/partido/texto; service filtra; página única com cards/fotos. | Manter a ideia de carregar → filtrar → listar. Em React, estado e componentes passam a atualizar a tela no navegador. |

## Tradução da sua AV1 para React

| Spring / Thymeleaf | React |
| --- | --- |
| `Controller` prepara o Model | Página coordena estado e chama serviços |
| `Service` lê CSV e filtra | Serviço carrega dados; função pura filtra |
| `th:each` | `{lista.map(item => <Card key={item.id} item={item} />)}` |
| `th:if` | `{condicao && <Componente />}` |
| `th:text` | `{item.nome}` |
| `@RequestParam` | `useSearchParams()` ou `useState()` |
| formulário GET recarrega página | `onSubmit` + `preventDefault()` atualizam estado |
| template `index.html` | JSX da página e componentes |

## Ordem sugerida de estudo

1. Entender `useState`, props, eventos, `map`, `filter` e formulários controlados.
2. Treinar JSON/CSV/API, `useEffect`, loading, erro e resultado vazio.
3. Treinar rotas, cadastro/login e sessão compartilhada.
4. Entender carrinho e a divisão cliente/servidor da Stripe.
5. Só então revisar integrações adicionais exigidas pelo professor.

A relação com sua AV1 ajuda a estudar a estrutura; não demonstra que candidatos, pagamentos ou login serão o tema da AV2.
