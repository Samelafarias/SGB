const Emprestimo = require('../models/Emprestimo');
const Livro = require('../models/Livro');

class RelatorioService {
    static async listarLivrosEmprestados() {
        return await Emprestimo.getAllBorrowedBooks();
    }

    static async listarUsuariosComEmprestimosAtrasados() {
        return await Emprestimo.getOverdueLoans();
    }

    static async listarLivrosDisponiveis() {
        return await Livro.getAvailableBooks();
    }
}

module.exports = RelatorioService;