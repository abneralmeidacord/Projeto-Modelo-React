import { useEffect, useState } from 'react';

// Use chaves fixas, e persista somente dados de demonstração.
export default function useLocalStorage(chave, inicial, validar = () => true) {
  const [valor, setValor] = useState(() => {
    try {
      const salvo = localStorage.getItem(chave);
      const dado = salvo === null ? inicial : JSON.parse(salvo);
      return validar(dado) ? dado : inicial;
    } catch { return inicial; }
  });
  const [erro, setErro] = useState('');
  useEffect(() => {
    try { localStorage.setItem(chave, JSON.stringify(valor)); setErro(''); }
    catch { setErro('Armazenamento indisponível: suas alterações podem não persistir.'); }
  }, [chave, valor]);
  return [valor, setValor, erro];
}
