// interface/menu.js

import { carregarDados } from '../dados/localStorage.js';

// Exibe ou oculta seções com base no ID
export function mostrarSecao(idSecao) {
  const secoes = document.querySelectorAll("section");
  secoes.forEach(secao => secao.style.display = "none");
  const secaoAtiva = document.getElementById(idSecao);
  if (secaoAtiva) {
    secaoAtiva.style.display = "block";
  }
}

// Preenche relatórios (exemplo para admin.html)
export function preencherRelatorios() {
  const emprestimos = carregarDados("emprestimos");
  const livros = carregarDados("livros");
  const usuarios = carregarDados("usuarios");

  const tabelaEmprestados = document.getElementById("tabelaEmprestados");
  const tabelaAtrasos = document.getElementById("tabelaAtrasos");
  const tabelaLivros = document.getElementById("tabelaLivrosDisponiveis");

  // Emprestados
  tabelaEmprestados.innerHTML = "";
  emprestimos.filter(e => !e.dataDevolucao).forEach(e => {
    const livro = livros.find(l => l.id === e.livroId);
    const usuario = usuarios.find(u => u.id === e.usuarioId);
    tabelaEmprestados.innerHTML += `<tr><td>${livro.titulo}</td><td>${usuario.nome}</td><td>${e.dataEmprestimo}</td></tr>`;
  });

  // Atrasos
  tabelaAtrasos.innerHTML = "";
  const hoje = new Date();
  emprestimos.filter(e => !e.dataDevolucao && new Date(e.dataPrevista) < hoje).forEach(e => {
    const livro = livros.find(l => l.id === e.livroId);
    const usuario = usuarios.find(u => u.id === e.usuarioId);
    tabelaAtrasos.innerHTML += `<tr><td>${usuario.nome}</td><td>${livro.titulo}</td><td>${e.dataPrevista}</td></tr>`;
  });

  // Livros disponíveis
  tabelaLivros.innerHTML = "";
  livros.filter(l => l.quantidade > 0).forEach(l => {
    tabelaLivros.innerHTML += `<tr><td>${l.titulo}</td><td>${l.autor}</td><td>${l.quantidade}</td></tr>`;
  });
}  

// Pode incluir mais funções conforme o crescimento da interface
