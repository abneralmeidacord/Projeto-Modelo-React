# Extras do professor que não entram no fluxo padrão

## Recuperação de senha

No SecureLogin, consulte `passwordRecoveryService.js`, `RecoverPassword.jsx`, `ResetPassword.jsx` e `sendEmailService.js`. O fluxo didático é: receber e-mail → gerar token aleatório → salvar associação e expiração → enviar link → ler token na URL → validar prazo → atualizar senha → invalidar token. Exemplo de leitura: `new URLSearchParams(location.search).get('token')`.

Este modelo não envia e-mails nem redefine senha. Se a questão exigir isso, implemente o requisito em vez de apresentar uma mensagem de recuperação fictícia. Em produção, token e redefinição ficam no backend; guardar tudo no navegador permite adulteração. Configure serviço de e-mail com os identificadores próprios pedidos pelo enunciado.

## reCAPTCHA

No `Login.jsx` do professor, o componente `react-google-recaptcha` preenche `captchaToken`; o formulário verifica se há token e reseta a tentativa. É uma demonstração do front. O backend precisa verificar o token com o provedor e manter a chave secreta fora de `VITE_*`. O modelo básico não exige CAPTCHA para funcionar.

## Favoritos com Supabase

A Pokédex atual separa `useFavoritos` → `favoriteService` → `favoriteRepository` → cliente Supabase. Revise também `supabase_favorites.sql`. O hook organiza loading, IDs favoritos, erro e salvamento; o repositório fala com o banco. Aqui usamos `localStorage` para eliminar a configuração inicial.

Se for pedido Supabase, troque a persistência pelo serviço e configure URL/chave pública permitida, tabela e políticas RLS conforme a atividade. Uma chave pública depende de políticas adequadas; chave de serviço/secret não deve ir ao React. Não copie credenciais de exemplos.

## Fontes para abrir rápido

- [SecureLoginPUC_React](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/tree/main/PROJETOS/React/SecureLoginPUC_React)
- [Pokedex](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/tree/main/PROJETOS/React/Pokedex)
- [CandidatosTSE_React](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/tree/main/PROJETOS/React/CandidatosTSE_React)
- [React: efeitos e cleanup](https://react.dev/learn/synchronizing-with-effects)
- [Vite: variáveis de ambiente](https://vite.dev/guide/env-and-mode)
