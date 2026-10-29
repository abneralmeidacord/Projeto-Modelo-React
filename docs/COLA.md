# Cola rápida de React

**Índice:** [estado/props](#1-estado-props-e-eventos) · [listas/filtros](#2-listas-filtros-e-ordenação) · [formulário](#3-formulário-controlado) · [fetch](#4-fetch-com-loading-erro-e-cleanup) · [rotas](#5-rotas-e-sessão) · [CRUD/storage](#6-crud-e-storage) · [POST](#7-post-para-backend) · [erros comuns](#8-erros-que-custam-tempo)

## 1. Estado, props e eventos

```jsx
import { useState } from 'react';
function Pai() {
  const [contador, setContador] = useState(0);
  return <Botao valor={contador} aoClicar={() => setContador((n) => n + 1)} />;
}
function Botao({ valor, aoClicar }) {
  return <button onClick={aoClicar}>{valor}</button>;
}
```

Estado pertence ao componente que precisa coordená-lo. Props descem; funções permitem ao filho avisar o pai. Não execute `onClick={salvar()}` na renderização: use `onClick={salvar}` ou `onClick={() => salvar(id)}`. Hooks ficam no topo do componente, antes de retornos condicionais, nunca dentro de loops ou `if`.

## 2. Listas, filtros e ordenação

```jsx
const categorias = [...new Set(itens.map((item) => item.categoria))];
const texto = busca.trim().toLowerCase();
const resultado = itens
  .filter((item) => !categoria || item.categoria === categoria)
  .filter((item) => item.nome.toLowerCase().includes(texto))
  .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
// filter devolveu uma nova lista: sort aqui não altera o array de estado.
return <>
  <p>{resultado.length} encontrado(s)</p>
  {resultado.length === 0 && <p>Nenhum resultado</p>}
  {resultado.map((item) => <ItemCard key={item.id} item={item} />)}
</>;
```

Para ordenar o array original sem alterar estado: `[...itens].sort(...)`. Para números: `(a, b) => Number(a.numero) - Number(b.numero)`. Para busca sem acento, consulte `src/utils/catalogo.js`. Não precisa de `useEffect` para calcular uma lista filtrada; `useMemo` só é necessário se o cálculo justificar memoização.

## 3. Formulário controlado

```jsx
const [form, setForm] = useState({ nome: '', email: '' });
function mudar(e) {
  const { name, value } = e.target;
  setForm((anterior) => ({ ...anterior, [name]: value }));
}
function enviar(e) {
  e.preventDefault();
  if (!form.nome.trim()) return;
  // chamar serviço ou atualizar lista
}
return <form onSubmit={enviar}>
  <input name="nome" value={form.nome} onChange={mudar} required />
  <input name="email" type="email" value={form.email} onChange={mudar} required />
  <button type="submit">Salvar</button>
  <button type="button" onClick={() => setForm({ nome: '', email: '' })}>Limpar</button>
</form>;
```

Checkbox usa `checked` e `e.target.checked`. Input numérico entrega texto: converta com `Number(e.target.value)` e valide. Validação HTML ajuda a interface; uma API também precisa validar no servidor.

## 4. Fetch com loading, erro e cleanup

```jsx
const [dados, setDados] = useState([]);
const [erro, setErro] = useState('');
const [carregando, setCarregando] = useState(true);
useEffect(() => {
  const controller = new AbortController();
  setCarregando(true); setErro('');
  fetch('/dados/itens.json', { signal: controller.signal })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(setDados)
    .catch((e) => { if (!controller.signal.aborted) setErro(e.message); })
    .finally(() => { if (!controller.signal.aborted) setCarregando(false); });
  return () => controller.abort();
}, []);
```

`[]`: ao montar; `[id]`: quando o id mudar; sem dependências: após cada render. Não marque a função do `useEffect` como `async`; use função interna ou promises. StrictMode pode montar/limpar/montar em desenvolvimento; mantenha cleanup. Fetch só rejeita automaticamente em erro de rede/cancelamento; HTTP 404/500 exigem `res.ok`. Para API com `{ results: [...] }`, use `setDados(json.results)`, não `setDados(json)`. `public/dados/a.json` é acessado por `/dados/a.json`; não por `/public/dados/a.json`.

## 5. Rotas e sessão

```jsx
// main.jsx: envolva App em <BrowserRouter> e <AuthProvider>.
<Routes>
  <Route path="/" element={<Catalogo />} />
  <Route path="/item/:id" element={<Detalhes />} />
  <Route path="/restrito" element={<ProtectedRoute><Home /></ProtectedRoute>} />
  <Route path="*" element={<p>Página não encontrada</p>} />
</Routes>
// No componente: const { id } = useParams();
// <Link to={`/item/${item.id}`}>Detalhes</Link>
// const navigate = useNavigate(); navigate('/');
```

`src/auth/AuthContext.jsx` contém o exemplo completo. `Context` compartilha usuário/login/logout. `Navigate` redireciona. Sessão no navegador é só demonstração; proteger rota React não protege uma API.

Filtros na URL:

```jsx
const [params, setParams] = useSearchParams();
const busca = params.get('busca') ?? '';
const novos = new URLSearchParams(params);
novos.set('busca', 'ana');
setParams(novos);
```

## 6. CRUD e storage

```js
// Sempre crie novos arrays/objetos, sem push/splice no estado.
setItens((lista) => [...lista, { id: crypto.randomUUID(), ...form }]);
setItens((lista) => lista.map((x) => x.id === id ? { ...x, ...form } : x));
setItens((lista) => lista.filter((x) => x.id !== id));
const item = itens.find((x) => x.id === id);
localStorage.setItem('chave', JSON.stringify(itens));
const salvos = JSON.parse(localStorage.getItem('chave') ?? '[]');
```

Trate falhas de leitura/escrita e valide os dados salvos. `localStorage` persiste entre sessões; `sessionStorage` é por aba/sessão de navegação. O hook `useLocalStorage` centraliza a persistência. Se mudar o JSON e os dados antigos continuarem, clique **Restaurar exemplos**.

## 7. POST para backend

```js
const res = await fetch('/api/recurso', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(form),
});
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const resposta = await res.json();
```

GET lê, POST cria, PUT costuma substituir, PATCH altera parcialmente, DELETE remove. O contrato da API define os detalhes. CORS é configurado no servidor: `mode: 'no-cors'` não dá acesso ao JSON. Variáveis `VITE_*` ficam públicas no navegador. Chaves `sk_*`, senhas de banco e credenciais privadas ficam no servidor.

## 8. Erros que custam tempo

| Sintoma | Verificar |
| --- | --- |
| Tela branca | Console, caminho do import, export default/nomeado, JSX e nomes com maiúscula |
| `map is not a function` | A resposta é objeto? Extraia `.results`, `.content` etc.; inicie lista com `[]` |
| `Cannot read properties of undefined` | Loading, formato da resposta, `obj?.campo`, valor inicial |
| `Unexpected token '<'` | Recebeu HTML em vez de JSON: endpoint errado ou API inexistente |
| Input não aceita digitação | `value` sem `onChange` ou chave `name` incorreta |
| Renderização infinita | `setState` na renderização; effect que altera sua própria dependência |
| Filtro perde outros campos | Copiar `URLSearchParams`/objeto antes de alterar |
| Botão recarrega página | `preventDefault` no submit; `type="button"` para ações secundárias |
| Build falha em outra máquina | Dependências no package.json, imports com mesma capitalização, Node compatível |
| Dados antigos aparecem | localStorage está sobrescrevendo a base; restaurar exemplos |

**Antes de enviar:** conferir requisitos do enunciado, estados loading/erro/vazio, `npm run build`, README de execução e arquivos visíveis no GitHub.
