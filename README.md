# Projeto Modelo React

Base pequena de **JavaScript + React + Vite** para revisar DIAW e consultar padrões durante a avaliação de 29/10/2026. Preparada para Abner com base nos projetos indicados do professor Aramuni. Os exemplos foram escritos para este modelo; não são uma cópia integral dos projetos do professor.

## Comece aqui

```bash
git clone https://github.com/abneralmeidacord/Projeto-Modelo-React.git
cd Projeto-Modelo-React
npm ci
npm run dev
```

Abra **http://localhost:5173**. Use Node **20.19+ ou 22.12+**. `npm install` também instala as dependências. No Windows, se o PowerShell bloquear `npm.ps1`, use `npm.cmd ci` / `npm.cmd run dev` ou o terminal CMD. A porta 5173 precisa estar livre.

**Funciona sem `.env` e sem banco:** catálogo local, filtros, favoritos, CRUD local, cadastro/login de demonstração e pedido simulado. A consulta à PokéAPI precisa de internet. Stripe é opcional, usa somente modo de teste e precisa de duas chaves próprias. O catálogo inicial vem de `public/dados/itens.json`; suas alterações ficam no navegador. “Restaurar exemplos” recarrega o JSON e limpa favoritos.

## Onde consultar primeiro

| Preciso fazer... | Abrir |
| --- | --- |
| Relembrar a sintaxe durante a prova | **[docs/COLA.md](docs/COLA.md)** |
| Adaptar para o tema do enunciado | **[docs/ADAPTAR.md](docs/ADAPTAR.md)** |
| Entender o que foi visto nos repositórios | [docs/ANALISE.md](docs/ANALISE.md) |
| Treinar hoje com um enunciado e checklist | [docs/TREINO.md](docs/TREINO.md) |
| Configurar Stripe e entender o fluxo | [docs/STRIPE.md](docs/STRIPE.md) |
| Recuperação de senha, CAPTCHA e Supabase | [docs/EXTRAS.md](docs/EXTRAS.md) |

## Mapa do código

```text
public/dados/itens.json       # dados de exemplo; troque pelo tema pedido
src/main.jsx                 # ponto de entrada, Router e AuthProvider
src/App.jsx                  # menu e rotas
src/pages/Catalogo.jsx       # carregar, filtrar, favoritar e CRUD
src/components/ItemCard.jsx  # props e eventos enviados ao pai
src/pages/ConsultaApi.jsx    # fetch + loading + erro + cancelamento
src/pages/Conta.jsx          # formulário de cadastro/login
src/auth/AuthContext.jsx     # sessão compartilhada e ProtectedRoute
src/services/usuarios.js     # cadastro/login LOCAL, só para demonstração
src/services/http.js         # fetch reutilizável e validação HTTP/JSON
src/services/dados.js        # carregar JSON; leitor CSV opcional
src/utils/catalogo.js        # busca, filtro e ordenação
src/hooks/useLocalStorage.js # persistência local de itens e favoritos
src/pages/Pagamento.jsx      # carrinho e chamada POST
src/data/produtos.js         # preços em centavos e cálculo de total
src/components/FormStripe.jsx # PaymentElement e confirmação
server/stripe.js            # cria PaymentIntent no Node, só sk_test_
vite.config.js              # conecta /api/stripe ao servidor local
tests/                      # filtros, total, HTTP e backend com Stripe simulada
```

## Testar e entregar

```bash
npm test
npm run build
npm run preview
```

`preview` usa normalmente http://localhost:4173. O build produz `dist/`. Este modelo serve para rodar localmente: hospedar apenas `dist/` não publica `server/stripe.js`. BrowserRouter precisa de fallback para `index.html` em hospedagem estática. A avaliação pode pedir uma estrutura diferente: siga o enunciado.

Para enviar seu projeto da avaliação, crie o repositório solicitado pelo professor e use a URL dele (não a deste modelo):

```bash
git init
git add .
git commit -m "Implementa atividade React"
git branch -M main
git remote add origin URL_DO_REPOSITORIO_DA_AVALIACAO
git push -u origin main
```

Se já existir `origin`, consulte `git remote -v` antes de alterar. Verifique no GitHub os arquivos enviados, o README, o nome do repositório e as permissões necessárias para a correção. Não envie `node_modules`, `.env.local` ou chaves. O aviso do quadro permite consulta ao GitHub; requisitos específicos de reutilização e entrega dependem do enunciado.

## Limites do exemplo

O login local ensina **formulário → serviço → contexto → rota**, mas não protege dados contra adulteração. Não use dados pessoais nem senhas reais. Recuperação de senha, EmailJS, CAPTCHA e Supabase são explicados em `docs/EXTRAS.md`, com links para os exemplos completos; não foram incluídos no fluxo padrão para evitar configuração obrigatória. A integração Stripe não foi exercitada com uma conta real sem chaves; os testes verificam seu contrato usando respostas simuladas. Produção exige backend de autenticação, validação, autorização, verificação de CAPTCHA e webhooks de pagamento.
