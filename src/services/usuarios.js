const CHAVE = 'modelo:usuarios';
const normalizarEmail = (email) => email.trim().toLowerCase();
function lerUsuarios() {
  const dados = JSON.parse(localStorage.getItem(CHAVE) ?? '[]');
  if (!Array.isArray(dados)) throw new Error('Dados de usuários inválidos no navegador.');
  return dados;
}
async function hash(senha) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(senha));
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, '0')).join('');
}
// DEMONSTRAÇÃO, como no exemplo do professor. Não é autenticação de produção.
// SHA-256 local evita texto puro; não impede adulteração nem substitui um backend.
export async function cadastrar({ nome, email, senha }) {
  if (!nome.trim() || !email.trim() || senha.length < 6) throw new Error('Preencha nome, e-mail e senha com pelo menos 6 caracteres.');
  const emailLimpo = normalizarEmail(email);
  const senhaHash = await hash(senha);
  const usuarios = lerUsuarios();
  if (usuarios.some((u) => u.email === emailLimpo)) throw new Error('E-mail já cadastrado.');
  localStorage.setItem(CHAVE, JSON.stringify([...usuarios, { nome: nome.trim(), email: emailLimpo, senhaHash }]));
}
export async function autenticar(email, senha) {
  const senhaHash = await hash(senha);
  const usuario = lerUsuarios().find((u) => u.email === normalizarEmail(email) && u.senhaHash === senhaHash);
  if (!usuario) throw new Error('E-mail ou senha incorretos.');
  return { nome: usuario.nome, email: usuario.email }; // Sessão não leva a senha/hash.
}
