// Funções para salvar e carregar dados do localStorage
export function salvarDados(chave, dados) {
  localStorage.setItem(chave, JSON.stringify(dados));
}

export function carregarDados(chave) {
  const dados = localStorage.getItem(chave);
  return dados ? JSON.parse(dados) : [];
}
