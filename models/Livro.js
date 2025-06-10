
const { connectDB } = require('../config/db');

class Livro {
    static async create(titulo, autor, isbn, ano_publicacao, quantidade_disponivel) {
        const conn = await connectDB();
        const [result] = await conn.execute( 
            'INSERT INTO livros (titulo, autor, isbn, ano_publicacao, quantidade_disponivel) VALUES (?, ?, ?, ?, ?)',
            [titulo, autor, isbn, ano_publicacao, quantidade_disponivel]
        );
        return result.insertId; 
    }

    static async findAll() {
        const conn = await connectDB();
        const [rows] = await conn.execute('SELECT * FROM livros'); 
        return rows;
    }

    static async findById(id) {
        const conn = await connectDB();
        const [rows] = await conn.execute('SELECT * FROM livros WHERE id = ?', [id]); 
        return rows[0]; 
    }

    static async findByISBN(isbn) {
        const conn = await connectDB();
        const [rows] = await conn.execute('SELECT * FROM livros WHERE isbn = ?', [isbn]);
        return rows[0]; 
    }

    static async updateQuantity(id, newQuantity) {
        const conn = await connectDB();
        const [result] = await conn.execute( 
            'UPDATE livros SET quantidade_disponivel = ? WHERE id = ?',
            [newQuantity, id]
        );
        return result.affectedRows; 
    }

    static async getAvailableBooks() {
        const conn = await connectDB();
        const [rows] = await conn.execute('SELECT * FROM livros WHERE quantidade_disponivel > 0'); 
        return rows;
    }
    
}

module.exports = Livro;