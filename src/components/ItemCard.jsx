export default function ItemCard({ item, favorito, aoFavoritar, aoDetalhar, aoEditar, aoExcluir }) {
  return <article className="card">
    <div className="linha"><span className="etiqueta">{item.categoria}</span><span>#{item.numero}</span></div>
    <h3>{item.nome}</h3><p>{item.descricao}</p>
    <div className="acoes"><button onClick={() => aoDetalhar(item)}>Detalhes</button>
      <button aria-pressed={favorito} aria-label={`Favoritar ${item.nome}`} onClick={() => aoFavoritar(item.id)}>{favorito ? '★ Salvo' : '☆ Favoritar'}</button>
      <button onClick={() => aoEditar(item)}>Editar</button><button className="perigo" onClick={() => aoExcluir(item.id)}>Excluir</button></div>
  </article>;
}
