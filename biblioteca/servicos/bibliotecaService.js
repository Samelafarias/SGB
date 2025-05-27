import { carregarDados, salvarDados } from "../dados/localStorage.js";

export function cadastrarLivro(livro) {
  const livros = carregarDados("livros");
  livros.push(livro);
  salvarDados("livros", livros);
}

export function cadastrarUsuario(usuario) {
  const usuarios = carregarDados("usuarios");
  usuarios.push(usuario);
  salvarDados("usuarios", usuarios);
}

export function registrarEmprestimo(emprestimo) {
  const emprestimos = carregarDados("emprestimos");
  const livros = carregarDados("livros");
  const livro = livros.find(l => l.id === emprestimo.livroId);
  
  if (livro && livro.quantidade > 0) {
    livro.quantidade--;
    emprestimos.push(emprestimo);
    salvarDados("livros", livros);
    salvarDados("emprestimos", emprestimos);
  } else {
    alert("Livro indisponível!");
  }
}

export function registrarDevolucao(emprestimoId, dataDevolucao) {
  const emprestimos = carregarDados("emprestimos");
  const livros = carregarDados("livros");

  const emprestimo = emprestimos.find(e => e.id === emprestimoId);
  if (emprestimo && !emprestimo.dataDevolucao) {
    emprestimo.dataDevolucao = dataDevolucao;
    const livro = livros.find(l => l.id === emprestimo.livroId);
    if (livro) livro.quantidade++;
  }

  salvarDados("emprestimos", emprestimos);
  salvarDados("livros", livros);
}

export function listarLivrosDisponiveis() {
  return carregarDados("livros").filter(livro => livro.quantidade > 0);
}

export function listarLivrosEmprestados() {
  return carregarDados("emprestimos").filter(e => !e.dataDevolucao);
}

export function listarAtrasos() {
  return carregarDados("emprestimos").filter(e => {
    return !e.dataDevolucao && new Date() > new Date(e.dataPrevista);
  });
}
