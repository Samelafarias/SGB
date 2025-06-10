const Livro = require('../models/Livro');

class LivroService {
    static async cadastrarLivro(titulo, autor, isbn, ano_publicacao, quantidade_disponivel) {
        if (!titulo || !autor || !isbn || !ano_publicacao || quantidade_disponivel === undefined) {
            throw new Error('Todos os campos do livro são obrigatórios.');
        }
        const existingBook = await Livro.findByISBN(isbn);
        if (existingBook) {
            // Se o livro já existe, apenas atualiza a quantidade
            const newQuantity = existingBook.quantidade_disponivel + quantidade_disponivel;
            await Livro.updateQuantity(existingBook.id, newQuantity);
            return `Livro "${titulo}" já existia. Quantidade atualizada para ${newQuantity}.`;
        }
        const livroId = await Livro.create(titulo, autor, isbn, ano_publicacao, quantidade_disponivel);
        return `Livro "${titulo}" cadastrado com sucesso! ID: ${livroId}`;
    }

    static async listarLivrosDisponiveis() {
        return await Livro.getAvailableBooks();
    }

    static async getLivroById(id) {
        return await Livro.findById(id);
    }

    static async updateLivroQuantity(id, newQuantity) {
        return await Livro.updateQuantity(id, newQuantity);
    }
}

module.exports = LivroService;