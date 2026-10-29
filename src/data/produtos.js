// Preços em CENTAVOS. O servidor usa este catálogo; não aceita total enviado pelo cliente.
export const produtos = [
  { id: 'caderno', nome: 'Caderno React', preco: 2500 },
  { id: 'caneca', nome: 'Caneca JavaScript', preco: 3500 },
];
export const moeda = (centavos) => (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
export function calcularPedido(itens) {
  if (!Array.isArray(itens) || !itens.length || itens.length > 20) throw new Error('Carrinho vazio ou inválido.');
  const vistos = new Set();
  const linhas = itens.map(({ id, quantidade }) => {
    const produto = produtos.find((p) => p.id === id);
    if (!produto || vistos.has(id) || !Number.isInteger(quantidade) || quantidade < 1 || quantidade > 10) throw new Error('Produto ou quantidade inválida.');
    vistos.add(id);
    return { ...produto, quantidade, subtotal: produto.preco * quantidade };
  });
  return { linhas, total: linhas.reduce((soma, linha) => soma + linha.subtotal, 0) };
}
