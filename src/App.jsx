import { NavLink, Route, Routes } from 'react-router-dom';
import Catalogo from './pages/Catalogo.jsx';
import ConsultaApi from './pages/ConsultaApi.jsx';
import Conta from './pages/Conta.jsx';
import Pagamento from './pages/Pagamento.jsx';
import { useAuth, ProtectedRoute } from './auth/AuthContext.jsx';

export default function App() {
  const { usuario, sair } = useAuth();
  return <>
    <header><div className="container topo"><div><span className="selo">DIAW / REACT</span>
      <h1>Projeto Modelo React</h1><p>Exemplos pequenos para estudar, entender e adaptar.</p></div>
      <div>{usuario ? <><span>Olá, {usuario.nome} </span><button onClick={sair}>Sair</button></> : <NavLink to="/conta">Entrar / cadastrar</NavLink>}</div>
    </div></header>
    <nav className="container" aria-label="Menu principal">
      <NavLink to="/" end>Catálogo</NavLink><NavLink to="/api">Consultar API</NavLink>
      <NavLink to="/conta">Conta</NavLink><NavLink to="/pagamento">Carrinho</NavLink>
      <NavLink to="/restrito">Área protegida</NavLink>
    </nav>
    <main className="container"><Routes>
      <Route path="/" element={<Catalogo />} />
      <Route path="/api" element={<ConsultaApi />} />
      <Route path="/conta" element={<Conta />} />
      <Route path="/pagamento" element={<Pagamento />} />
      <Route path="/restrito" element={<ProtectedRoute><section className="painel"><h2>Área protegida</h2><p>Você entrou! O contexto compartilha a sessão entre as telas.</p></section></ProtectedRoute>} />
      <Route path="*" element={<section><h2>Página não encontrada</h2><NavLink to="/">Voltar ao catálogo</NavLink></section>} />
    </Routes></main>
    <footer className="container">JavaScript + React + Vite · Guia de consulta no README e em docs/COLA.md</footer>
  </>;
}
