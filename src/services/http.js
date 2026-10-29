// fetch NÃO lança erro automaticamente para HTTP 404/500: confira response.ok.
export async function requisitarJson(url, options = {}) {
  const resposta = await fetch(url, options);
  const tipo = resposta.headers.get('content-type') ?? '';
  if (!tipo.includes('json')) throw new Error('A resposta não é JSON. Confira a URL da API.');
  const dados = await resposta.json();
  if (!resposta.ok) throw new Error(dados.message || `Erro HTTP ${resposta.status}`);
  return dados;
}
