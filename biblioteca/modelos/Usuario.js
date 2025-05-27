// modelos/Usuario.js
class Usuario {
  constructor(id, nome, matricula, curso, senha, tipo = "usuario") {
    this.id = id;
    this.nome = nome;
    this.matricula = matricula;
    this.curso = curso;
    this.senha = senha;
    this.tipo = tipo;
  }
}
