export class Emprestimo {
  constructor(id, usuarioId, livroId, dataEmprestimo, dataPrevista, dataDevolucao = null) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.livroId = livroId;
    this.dataEmprestimo = dataEmprestimo;
    this.dataPrevista = dataPrevista;
    this.dataDevolucao = dataDevolucao;
  }

  estaAtrasado() {
    if (!this.dataDevolucao) return false;
    return new Date(this.dataDevolucao) > new Date(this.dataPrevista);
  }
}
