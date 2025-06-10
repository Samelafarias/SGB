const { connectDB } = require('../config/db');

class Emprestimo {
    static async create(livro_id, usuario_id, data_emprestimo, data_prevista_devolucao) {
        const conn = await connectDB();
        const [result] = await conn.execute(
            'INSERT INTO emprestimos (livro_id, usuario_id, data_emprestimo, data_prevista_devolucao, status) VALUES (?, ?, ?, ?, ?)',
            [livro_id, usuario_id, data_emprestimo, data_prevista_devolucao, 'emprestado']
        );
        return result.insertId;
    }

    static async findActiveByUserId(userId) {
        const conn = await connectDB();
        const [rows] = await conn.execute(
            'SELECT * FROM emprestimos WHERE usuario_id = ? AND status = ?',
            [userId, 'emprestado']
        );
        return rows;
    }

    static async findActiveByBookId(bookId) {
        const conn = await connectDB();
        const [rows] = await conn.execute(
            'SELECT * FROM emprestimos WHERE livro_id = ? AND status = ?',
            [bookId, 'emprestado']
        );
        return rows;
    }

    static async markAsReturned(emprestimoId, data_devolucao, status) {
        const conn = await connectDB();
        const [result] = await conn.execute(
            'UPDATE emprestimos SET data_devolucao = ?, status = ? WHERE id = ?',
            [data_devolucao, status, emprestimoId]
        );
        return result.affectedRows;
    }

    static async getOverdueLoans() {
        const conn = await connectDB();
        const today = new Date().toISOString().split('T')[0]; // Data de hoje no formato YYYY-MM-DD
        const [rows] = await conn.execute(`
            SELECT e.*, l.titulo AS livro_titulo, u.nome AS usuario_nome
            FROM emprestimos e
            JOIN livros l ON e.livro_id = l.id
            JOIN usuarios u ON e.usuario_id = u.id
            WHERE e.status = 'emprestado' AND e.data_prevista_devolucao < ?
        `, [today]);
        return rows;
    }

    static async getAllBorrowedBooks() {
        const conn = await connectDB();
        const [rows] = await conn.execute(`
            SELECT e.*, l.titulo AS livro_titulo, u.nome AS usuario_nome
            FROM emprestimos e
            JOIN livros l ON e.livro_id = l.id
            JOIN usuarios u ON e.usuario_id = u.id
            WHERE e.status = 'emprestado'
        `);
        return rows;
    }
}

module.exports = Emprestimo;