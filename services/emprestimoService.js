const Emprestimo = require('../models/Emprestimo');
const Livro = require('../models/Livro');
const Usuario = require('../models/Usuario');
const { addDays } = require('../utils/dateUtils'); 

const MAX_LIVROS_EMPRESTIMO = 3; 

class EmprestimoService {
    static async realizarEmprestimo(livroId, usuarioId) {
        const livro = await Livro.findById(livroId);
        const usuario = await Usuario.findById(usuarioId);

        if (!livro) throw new Error('Livro não encontrado.');
        if (!usuario) throw new Error('Usuário não encontrado.');
        if (livro.quantidade_disponivel <= 0) throw new Error('Livro indisponível para empréstimo.');

        const emprestimosAtivos = await Emprestimo.findActiveByUserId(usuarioId);
        if (emprestimosAtivos.length >= MAX_LIVROS_EMPRESTIMO) {
            throw new Error(`Usuário já possui ${MAX_LIVROS_EMPRESTIMO} livros emprestados. Limite atingido.`);
        }

        const dataEmprestimo = new Date();
        const dataPrevistaDevolucao = addDays(dataEmprestimo, 7); 

        await Livro.updateQuantity(livroId, livro.quantidade_disponivel - 1);
        const emprestimoId = await Emprestimo.create(
            livroId,
            usuarioId,
            dataEmprestimo.toISOString().split('T')[0],
            dataPrevistaDevolucao.toISOString().split('T')[0]
        );
        return `Empréstimo do livro "<span class="math-inline">\{livro\.titulo\}" para "</span>{usuario.nome}" realizado com sucesso! ID: ${emprestimoId}`;
    }

    static async realizarDevolucao(emprestimoId) {
        const conn = await require('../config/db').connectDB(); 
        await conn.beginTransaction(); 

        try {
            const [emprestimos] = await conn.execute('SELECT * FROM emprestimos WHERE id = ? AND status = ?', [emprestimoId, 'emprestado']);
            const emprestimo = emprestimos[0];

            if (!emprestimo) {
                throw new Error('Empréstimo não encontrado ou já devolvido.');
            }

            const livro = await Livro.findById(emprestimo.livro_id);
            if (!livro) {
                throw new Error('Livro associado ao empréstimo não encontrado.'); 
            }

            const dataDevolucao = new Date();
            const dataPrevistaDevolucao = new Date(emprestimo.data_prevista_devolucao);
            const status = dataDevolucao > dataPrevistaDevolucao ? 'atrasado' : 'devolvido';

            await Emprestimo.markAsReturned(emprestimoId, dataDevolucao.toISOString().split('T')[0], status);
            await Livro.updateQuantity(livro.id, livro.quantidade_disponivel + 1);

            await conn.commit(); 
            return `Devolução do livro "${livro.titulo}" realizada com sucesso! Status: ${status}`;
        } catch (error) {
            await conn.rollback(); 
            throw error;
        }
    }
}

module.exports = EmprestimoService;