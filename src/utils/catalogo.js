export const normalizar = (valor) => String(valor ?? '').normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

// Função pura: recebe dados e filtros, devolve uma NOVA lista.
export function filtrarItens(itens, { busca = '', categoria = '', ordem = 'nome', favoritos = null } = {}) {
  const texto = normalizar(busca);
  return itens.filter((item) =>
    (!texto || normalizar(`${item.nome} ${item.numero}`).includes(texto)) &&
    (!categoria || item.categoria === categoria) &&
    (!favoritos || favoritos.includes(item.id)),
  ).sort((a, b) => ordem === 'numero'
    ? Number(a.numero) - Number(b.numero)
    : a.nome.localeCompare(b.nome, 'pt-BR'));
}
