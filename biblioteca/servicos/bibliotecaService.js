// servicos/bibliotecaService.js

// Importa as funções do novo serviço de banco de dados
import {
    initializeDatabase,
    insertLivro, getLivros, updateLivroQuantidade, getLivroById,
    insertUsuario, getUsuarioByMatriculaSenha, getUsuarioById,
    insertEmprestimo, getEmprestimos, updateEmprestimoDevolucao, getEmprestimoById,
    saveDatabase // Importa saveDatabase para chamar após operações importantes
} from './databaseService.js'; // Ajuste o caminho se você colocou databaseService em outra pasta


initializeDatabase().catch(console.error);


export async function cadastrarLivro(livro) {
    // SQLite gera o ID automaticamente
    await insertLivro(livro);
    console.log("Livro cadastrado:", livro);
}

export async function cadastrarUsuario(usuario) {
    // SQLite gera o ID automaticamente. Inclua senha e tipo.
    await insertUsuario(usuario);
    console.log("Usuário cadastrado:", usuario);
}

export async function registrarEmprestimo(emprestimoData) {
    // emprestimoData deve conter usuarioId e livroId
    const livro = await getLivroById(emprestimoData.livroId);

    if (!livro) {
        alert("Livro não encontrado!");
        return;
    }

    if (livro.quantidadeDisponivel <= 0) {
        alert("Livro indisponível para empréstimo!");
        return;
    }

    // Diminui a quantidade do livro
    await updateLivroQuantidade(livro.id, livro.quantidadeDisponivel - 1);

    // Prepara os dados do empréstimo para inserção
    const dataEmprestimo = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
    const dataPrevistaDevolucao = new Date();
    dataPrevistaDevolucao.setDate(dataPrevistaDevolucao.getDate() + 7); // +7 dias
    const emprestimo = {
        usuarioId: emprestimoData.usuarioId,
        livroId: emprestimoData.livroId,
        dataEmprestimo: dataEmprestimo,
        dataPrevistaDevolucao: dataPrevistaDevolucao.toISOString().split('T')[0],
        atrasado: 0 // Não está atrasado no momento do empréstimo
    };

    await insertEmprestimo(emprestimo);
    console.log("Empréstimo registrado:", emprestimo);
}

export async function registrarDevolucao(emprestimoId) { // Agora recebe apenas o ID do empréstimo
    const emprestimo = await getEmprestimoById(emprestimoId);
    if (!emprestimo) {
        alert("Empréstimo não encontrado!");
        return;
    }
    if (emprestimo.dataDevolucao) { // Já foi devolvido
        alert("Este empréstimo já foi devolvido.");
        return;
    }

    const livro = await getLivroById(emprestimo.livroId);
    if (!livro) {
        alert("Livro associado ao empréstimo não encontrado!");
        return;
    }

    const dataDevolucao = new Date().toISOString().split('T')[0];
    const dataPrevista = new Date(emprestimo.dataPrevistaDevolucao);
    const dataReal = new Date(dataDevolucao);

    const atrasado = dataReal > dataPrevista ? 1 : 0; // 1 se atrasado, 0 caso contrário

    await updateEmprestimoDevolucao(emprestimoId, dataDevolucao, atrasado);
    await updateLivroQuantidade(livro.id, livro.quantidadeDisponivel + 1); // Aumenta a quantidade disponível
    console.log("Devolução registrada para empréstimo ID:", emprestimoId, "Atrasado:", atrasado);
}

export async function listarLivrosDisponiveis() {
    return await getLivros({ disponiveis: true });
}

export async function listarLivrosEmprestados() {
    // Retorna todos os empréstimos que ainda não foram devolvidos
    const emprestimos = await getEmprestimos({ naoDevolvidos: true });

    const resultados = [];
    for (const emp of emprestimos) {
        const livro = await getLivroById(emp.livroId);
        const usuario = await getUsuarioById(emp.usuarioId);
        resultados.push({
            id: emp.id,
            livro: livro ? livro.titulo : 'Desconhecido',
            usuario: usuario ? usuario.nome : 'Desconhecido',
            dataEmprestimo: emp.dataEmprestimo,
            dataPrevistaDevolucao: emp.dataPrevistaDevolucao
        });
    }
    return resultados;
}

export async function listarAtrasos() {
    // Retorna todos os empréstimos não devolvidos que estão com data prevista passada e atrasado = 1
    const emprestimosAtrasados = await getEmprestimos({ atrasados: true });

    // Para listar os detalhes do livro e usuário, você precisará fazer "joins" ou buscar os dados separadamente
    const resultados = [];
    for (const emp of emprestimosAtrasados) {
        const livro = await getLivroById(emp.livroId);
        const usuario = await getUsuarioById(emp.usuarioId);
        resultados.push({
            id: emp.id,
            livro: livro ? livro.titulo : 'Desconhecido',
            usuario: usuario ? usuario.nome : 'Desconhecido',
            dataEmprestimo: emp.dataEmprestimo,
            dataPrevistaDevolucao: emp.dataPrevistaDevolucao
        });
    }
    return resultados;
}

// Funções para login (exclusivo para main.js ou outro serviço de autenticação)
export async function autenticarUsuario(matricula, senha) {
    return await getUsuarioByMatriculaSenha(matricula, senha);
}
