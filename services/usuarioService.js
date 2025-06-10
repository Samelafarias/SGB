const Usuario = require('../models/Usuario');

class UsuarioService {
    static async cadastrarUsuario(nome, matricula, curso) {
        if (!nome || !matricula || !curso) {
            throw new Error('Todos os campos do usuário são obrigatórios.');
        }
        const existingUser = await Usuario.findByMatricula(matricula);
        if (existingUser) {
            throw new Error(`Usuário com matrícula ${matricula} já cadastrado.`);
        }
        const usuarioId = await Usuario.create(nome, matricula, curso);
        return `Usuário "${nome}" cadastrado com sucesso! ID: ${usuarioId}`;
    }

    static async getUsuarioById(id) {
        return await Usuario.findById(id);
    }

    static async getUsuarioByMatricula(matricula) {
        return await Usuario.findByMatricula(matricula);
    }
}

module.exports = UsuarioService;