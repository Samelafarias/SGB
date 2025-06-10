const { connectDB } = require('../config/db');

class Usuario {
    static async create(nome, matricula, curso) {
        const conn = await connectDB();
        const [result] = await conn.execute(
            'INSERT INTO usuarios (nome, matricula, curso) VALUES (?, ?, ?)',
            [nome, matricula, curso]
        );
        return result.insertId;
    }

    static async findAll() {
        const conn = await connectDB();
        const [rows] = await conn.execute('SELECT * FROM usuarios');
        return rows;
    }

    static async findById(id) {
        const conn = await connectDB();
        const [rows] = await conn.execute('SELECT * FROM usuarios WHERE id = ?', [id]);
        return rows[0];
    }

    static async findByMatricula(matricula) {
        const conn = await connectDB();
        const [rows] = await conn.execute('SELECT * FROM usuarios WHERE matricula = ?', [matricula]);
        return rows[0];
    }
    // ...
}

module.exports = Usuario;