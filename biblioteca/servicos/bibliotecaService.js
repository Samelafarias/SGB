// servicos/bibliotecaService.js

// Importa as funções do novo serviço de banco de dados
import {
    initializeDatabase,
    insertLivro, getLivros, updateLivroQuantidade, getLivroById,
    insertUsuario, getUsuarioByMatriculaSenha, getUsuarioById,
    insertEmprestimo, getEmprestimos, updateEmprestimoDevolucao, getEmprestimoById,
    saveDatabase 
} from './databaseService.js'; 


initializeDatabase().catch(console.error);


export async function cadastrarLivro(livro) {
    await insertLivro(livro);
    console.log("Livro cadastrado:", livro);
}

export async function cadastrarUsuario(usuario) {
    await insertUsuario(usuario);
    console.log("Usuário cadastrado:", usuario);
}

export async function registrarEmprestimo(emprestimoData) {
    const livro = await getLivroById(emprestimoData.livroId);

    if (!livro) {
        alert("Livro não encontrado!");
        return;
    }

    if (livro.quantidadeDisponivel <= 0) {
        alert("Livro indisponível para empréstimo!");
        return;
    }

    await updateLivroQuantidade(livro.id, livro.quantidadeDisponivel - 1);

    const dataEmprestimo = new Date().toISOString().split('T')[0]; 
    const dataPrevistaDevolucao = new Date();
    dataPrevistaDevolucao.setDate(dataPrevistaDevolucao.getDate() + 7); 
    const emprestimo = {
        usuarioId: emprestimoData.usuarioId,
        livroId: emprestimoData.livroId,
        dataEmprestimo: dataEmprestimo,
        dataPrevistaDevolucao: dataPrevistaDevolucao.toISOString().split('T')[0],
        atrasado: 0 
    };

    await insertEmprestimo(emprestimo);
    console.log("Empréstimo registrado:", emprestimo);
}

export async function registrarDevolucao(emprestimoId) { 
    const emprestimo = await getEmprestimoById(emprestimoId);
    if (!emprestimo) {
        alert("Empréstimo não encontrado!");
        return;
    }
    if (emprestimo.dataDevolucao) { 
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

    const atrasado = dataReal > dataPrevista ? 1 : 0; 

    await updateEmprestimoDevolucao(emprestimoId, dataDevolucao, atrasado);
    await updateLivroQuantidade(livro.id, livro.quantidadeDisponivel + 1);
    console.log("Devolução registrada para empréstimo ID:", emprestimoId, "Atrasado:", atrasado);
}

export async function listarLivrosDisponiveis() {
    return await getLivros({ disponiveis: true });
}

export async function listarLivrosEmprestados() {
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
  
    const emprestimosAtrasados = await getEmprestimos({ atrasados: true });

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


export async function autenticarUsuario(matricula, senha) {
    return await getUsuarioByMatriculaSenha(matricula, senha);
}
