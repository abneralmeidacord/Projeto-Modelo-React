import Papa from 'papaparse';
import { requisitarJson } from './http.js';

export function carregarItens(signal) {
  // Para outra API, troque a URL e mapeie os campos para { id, nome, categoria, numero, descricao }.
  return requisitarJson('/dados/itens.json', { signal });
}

// Exemplo opcional para uma base como a AV1. Não carrega CSV por padrão.
export async function carregarCsv(url, signal) {
  const resposta = await fetch(url, { signal });
  if (!resposta.ok) throw new Error(`Erro HTTP ${resposta.status}`);
  const buffer = await resposta.arrayBuffer();
  // CSV oficial do TSE costuma usar ; e ISO-8859-1. Ajuste conforme o arquivo fornecido.
  const texto = new TextDecoder('iso-8859-1').decode(buffer);
  const resultado = Papa.parse(texto, { header: true, delimiter: ';', skipEmptyLines: 'greedy' });
  if (resultado.errors.length) throw new Error('CSV inválido: ' + resultado.errors[0].message);
  return resultado.data; // Faça o .map() aqui; não use split(';') porque existem campos entre aspas.
}
