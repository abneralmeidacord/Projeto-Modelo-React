import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ItemCard from '../components/ItemCard.jsx';
import useLocalStorage from '../hooks/useLocalStorage.js';
import { carregarItens } from '../services/dados.js';
import { filtrarItens } from '../utils/catalogo.js';

const vazio = { nome: '', categoria: '', numero: '', descricao: '' };

export default function Catalogo() {
  const [itens, setItens, erroStorage] = useLocalStorage('modelo:itens', null, (x) => x === null || Array.isArray(x));
  const [favoritos, setFavoritos] = useLocalStorage('modelo:favoritos', [], Array.isArray);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [tentativa, setTentativa] = useState(0);
  const [detalhe, setDetalhe] = useState(null);
  const [form, setForm] = useState(vazio);
  const [editando, setEditando] = useState(null);
  const [params, setParams] = useSearchParams();
  const busca = params.get('busca') ?? '';
  const categoria = params.get('categoria') ?? '';
  const ordem = params.get('ordem') ?? 'nome';
  const soFavoritos = params.get('favoritos') === '1';

  // Effect sincroniza com o arquivo externo. Cleanup cancela ao sair da tela.
  useEffect(() => {
    if (itens !== null) { setCarregando(false); return; }
    const controller = new AbortController();
    setCarregando(true); setErro('');
    carregarItens(controller.signal)
      .then(setItens)
      .catch((e) => { if (!controller.signal.aborted) setErro(e.message); })
      .finally(() => { if (!controller.signal.aborted) setCarregando(false); });
    return () => controller.abort();
  }, [itens, setItens, tentativa]);

  function mudarFiltro(chave, valor) {
    const novos = new URLSearchParams(params);
    if (valor) novos.set(chave, valor); else novos.delete(chave);
    setParams(novos, { replace: true });
  }
  const categorias = [...new Set((itens ?? []).map((item) => item.categoria))].sort();
  // Estado derivado: não precisa de outro useState/useEffect para filtrar.
  const resultado = filtrarItens(itens ?? [], { busca, categoria, ordem, favoritos: soFavoritos ? favoritos : null });
  function favoritar(id) {
    setFavoritos((anteriores) => anteriores.includes(id) ? anteriores.filter((x) => x !== id) : [...anteriores, id]);
  }
  function salvar(event) {
    event.preventDefault();
    if (!form.nome.trim() || !form.categoria.trim() || !form.numero.trim()) return;
    const item = { ...form, nome: form.nome.trim(), categoria: form.categoria.trim(), id: editando ?? crypto.randomUUID() };
    setItens((anteriores) => editando === null ? [...(anteriores ?? []), item] : anteriores.map((x) => x.id === editando ? item : x));
    setForm(vazio); setEditando(null);
  }
  function excluir(id) {
    setItens((anteriores) => anteriores.filter((x) => x.id !== id));
    setFavoritos((anteriores) => anteriores.filter((x) => x !== id));
    if (editando === id) { setForm(vazio); setEditando(null); }
  }
  return <>
    <div className="titulo"><span className="selo">01 / LISTAS E ESTADO</span><h2>Catálogo de exemplo</h2><p>JSON local → filtros → cards → detalhes. Reaproveite para candidatos, produtos ou Pokémon.</p></div>
    <section className="painel filtros" aria-label="Filtros">
      <label>Buscar por nome ou número<input value={busca} onChange={(e) => mudarFiltro('busca', e.target.value)} placeholder="Ex.: pika ou 025" /></label>
      <label>Categoria<select value={categoria} onChange={(e) => mudarFiltro('categoria', e.target.value)}><option value="">Todas</option>{categorias.map((x) => <option key={x}>{x}</option>)}</select></label>
      <label>Ordenar<select value={ordem} onChange={(e) => mudarFiltro('ordem', e.target.value)}><option value="nome">Nome</option><option value="numero">Número</option></select></label>
      <label className="check"><input type="checkbox" checked={soFavoritos} onChange={(e) => mudarFiltro('favoritos', e.target.checked ? '1' : '')} />Só favoritos</label>
      <button onClick={() => setParams({})}>Limpar filtros</button>
    </section>
    {(erro || erroStorage) && <p role="alert" className="erro">{erro || erroStorage} {erro && <button onClick={() => setTentativa((x) => x + 1)}>Tentar novamente</button>}</p>}
    {carregando ? <p role="status">Carregando itens...</p> : <>
      <p role="status">{resultado.length} de {(itens ?? []).length} item(ns)</p>
      {!erro && resultado.length === 0 && <p>Nenhum item encontrado. Limpe os filtros ou adicione um item.</p>}
      <div className="grade">{resultado.map((item) => <ItemCard key={item.id} item={item} favorito={favoritos.includes(item.id)} aoFavoritar={favoritar} aoDetalhar={setDetalhe}
        aoEditar={(x) => { setForm(x); setEditando(x.id); }} aoExcluir={excluir} />)}</div>
    </>}
    {detalhe && <section className="painel" aria-label="Detalhes"><h2>{detalhe.nome}</h2><p>Número: {detalhe.numero} · Categoria: {detalhe.categoria}</p><p>{detalhe.descricao}</p><button onClick={() => setDetalhe(null)}>Fechar detalhes</button></section>}
    <form className="painel" onSubmit={salvar}><h2>{editando === null ? 'Adicionar item' : 'Editar item'}</h2>
      <div className="grade-form">{['nome', 'categoria', 'numero', 'descricao'].map((campo) => <label key={campo}>{campo}<input name={campo} value={form[campo]} required={campo !== 'descricao'} onChange={(e) => setForm((atual) => ({ ...atual, [e.target.name]: e.target.value }))} /></label>)}</div>
      <div className="acoes"><button className="primario" disabled={carregando || Boolean(erro)}>{editando === null ? 'Adicionar' : 'Salvar edição'}</button><button type="button" onClick={() => { setForm(vazio); setEditando(null); }}>Cancelar edição</button>
      <button type="button" onClick={() => { setItens(null); setFavoritos([]); setParams({}); setDetalhe(null); setForm(vazio); setEditando(null); }}>Restaurar exemplos</button></div>
    </form>
  </>;
}
