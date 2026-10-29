# Treino para hoje

Faça uma rodada com o código fechado e depois consulte a cola para completar o que faltou. Tempo sugerido: 75–90 minutos. É um exercício criado para revisão, não o enunciado da avaliação.

## Desafio: catálogo de candidatos fictícios

Crie uma aplicação React que carregue um JSON, liste cards e permita buscar por nome/número, filtrar por cargo e partido, limpar filtros e exibir contagem. Cada card terá nome, número, cargo, partido e botão para detalhes. Exiba carregamento, erro de leitura e nenhum resultado. Acrescente favoritos que sobrevivam ao F5.

Use inicialmente dados fictícios:

```json
[
  { "id": "1", "nome": "Ana Exemplo", "numero": "100", "categoria": "Senador", "partido": "P1", "descricao": "Registro fictício para estudo" },
  { "id": "2", "nome": "Bruno Exemplo", "numero": "200", "categoria": "Governador", "partido": "P2", "descricao": "Registro fictício para estudo" },
  { "id": "3", "nome": "Carla Exemplo", "numero": "300", "categoria": "Senador", "partido": "P2", "descricao": "Registro fictício para estudo" }
]
```

## Rodadas

1. **30 min:** dados, serviço e cards; pesquisar; filtro por cargo; resultado vazio.
2. **15 min:** filtro por partido combinado, detalhes, favoritos, limpar filtros.
3. **15 min:** cadastro/login, entrar em área protegida, sair e bloquear acesso direto.
4. **15 min:** carrinho com quantidades e total; explique o POST e onde cada chave Stripe fica.
5. **10 min:** build, README e simulação de entrega no GitHub.

## Critérios de autocorreção

- [ ] Sei explicar onde ficam os dados, o estado e a renderização.
- [ ] Busca e filtros combinados retornam Ana para Senador + P1.
- [ ] Senador + P2 retorna Carla; Governador + P1 retorna vazio.
- [ ] Limpar volta a mostrar três registros.
- [ ] Favorito continua após F5; excluir favorito remove o ID salvo.
- [ ] API com nome inválido mostra erro e depois permite nova busca.
- [ ] Enviar formulário não recarrega a página; campos são controlados.
- [ ] Cadastro duplicado e senha errada mostram erro.
- [ ] Deslogado, abrir `/restrito` leva à conta; após login, retorna à rota.
- [ ] Carrinho vazio desabilita pedido; 2 cadernos + 1 caneca = R$ 85,00.
- [ ] Sei distinguir pedido simulado de PaymentIntent de teste.
- [ ] `npm test` e `npm run build` passam; sei conferir o código no GitHub.

Se faltar tempo, priorize listas/filtros, eventos, formulários e fetch. Para cada trecho copiado, explique em voz alta o que entra, o que muda no estado e o que aparece na tela.
