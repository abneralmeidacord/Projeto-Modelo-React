import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { cadastrar } from '../services/usuarios.js';

export default function Conta() {
  const [modo, setModo] = useState('login');
  const [form, setForm] = useState({ nome: '', email: '', senha: '' });
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');
  const [enviando, setEnviando] = useState(false);
  const { usuario, entrar } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  async function enviar(event) {
    event.preventDefault(); setErro(''); setAviso(''); setEnviando(true);
    try {
      if (modo === 'cadastro') {
        await cadastrar(form); setModo('login'); setForm((atual) => ({ ...atual, senha: '' }));
        setAviso('Cadastro realizado. Entre com seu e-mail e senha.');
      } else {
        await entrar(form.email, form.senha);
        navigate(location.state?.destino || '/restrito', { replace: true });
      }
    } catch (e) { setErro(e.message); }
    finally { setEnviando(false); }
  }
  return <>
    <div className="titulo"><span className="selo">03 / FORMULÁRIOS E CONTEXTO</span><h2>Cadastro e login</h2><p>Simulação local para estudo. Use dados fictícios; a proteção real deve existir no servidor.</p></div>
    {usuario ? <section className="painel"><p>Sessão de {usuario.nome} ({usuario.email})</p><Link to="/restrito">Abrir área protegida</Link></section> :
      <form className="painel estreito" onSubmit={enviar}><h2>{modo === 'login' ? 'Entrar' : 'Criar conta de teste'}</h2>
        {modo === 'cadastro' && <label>Nome<input required name="nome" autoComplete="name" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></label>}
        <label>E-mail<input type="email" required autoComplete="username" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label>Senha<input type="password" required minLength={6} autoComplete={modo === 'login' ? 'current-password' : 'new-password'} value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} /></label>
        {erro && <p role="alert" className="erro">{erro}</p>}{aviso && <p role="status">{aviso}</p>}
        <div className="acoes"><button className="primario" disabled={enviando}>{enviando ? 'Aguarde...' : modo === 'login' ? 'Entrar' : 'Cadastrar'}</button>
          <button type="button" disabled={enviando} onClick={() => { setModo(modo === 'login' ? 'cadastro' : 'login'); setErro(''); setAviso(''); }}>{modo === 'login' ? 'Quero me cadastrar' : 'Voltar ao login'}</button></div>
      </form>}
  </>;
}
