import { createContext, useContext, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { autenticar } from '../services/usuarios.js';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    try { const salvo = JSON.parse(sessionStorage.getItem('modelo:sessao')); return salvo?.email && salvo?.nome ? salvo : null; }
    catch { return null; }
  });
  async function entrar(email, senha) {
    const dados = await autenticar(email, senha);
    sessionStorage.setItem('modelo:sessao', JSON.stringify(dados));
    setUsuario(dados);
  }
  function sair() {
    try { sessionStorage.removeItem('modelo:sessao'); }
    finally { setUsuario(null); }
  }
  return <AuthContext.Provider value={{ usuario, entrar, sair }}>{children}</AuthContext.Provider>;
}
export function ProtectedRoute({ children }) {
  const { usuario } = useAuth();
  const location = useLocation();
  return usuario ? children : <Navigate to="/conta" replace state={{ destino: location.pathname }} />;
}
