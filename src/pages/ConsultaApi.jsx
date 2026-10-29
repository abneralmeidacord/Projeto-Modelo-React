import { useEffect, useState } from 'react';
import { requisitarJson } from '../services/http.js';

export default function ConsultaApi() {
  const [texto, setTexto] = useState('pikachu');
  const [consulta, setConsulta] = useState(null);
  const [pokemon, setPokemon] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  useEffect(() => {
    if (!consulta) return;
    const controller = new AbortController();
    setCarregando(true); setErro(''); setPokemon(null);
    requisitarJson(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(consulta.termo)}`, { signal: controller.signal })
      .then(setPokemon)
      .catch((e) => { if (!controller.signal.aborted) setErro(e.message); })
      .finally(() => { if (!controller.signal.aborted) setCarregando(false); });
    return () => controller.abort();
  }, [consulta]);
  return <>
    <div className="titulo"><span className="selo">02 / FETCH E USEEFFECT</span><h2>Consultar uma API</h2><p>Busca real na PokéAPI. Esta tela precisa de internet.</p></div>
    <form className="painel linha" onSubmit={(e) => { e.preventDefault(); const termo = texto.trim().toLowerCase(); if (termo) setConsulta({ termo }); }}>
      <label>Nome ou número do Pokémon<input required value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="pikachu ou 25" /></label><button className="primario">Buscar Pokémon</button>
    </form>
    {carregando && <p role="status">Consultando...</p>}
    {erro && <p role="alert" className="erro">{erro}. Confira o nome, a conexão e tente novamente.</p>}
    {pokemon && <article className="card"><h2>{pokemon.name}</h2>
      {pokemon.sprites?.front_default && <img width="150" height="150" src={pokemon.sprites.front_default} alt={pokemon.name} />}
      <p>#{pokemon.id} · Altura: {pokemon.height / 10} m · Peso: {pokemon.weight / 10} kg</p>
      <p>Tipos: {pokemon.types.map((x) => x.type.name).join(', ')}</p>
    </article>}
  </>;
}
