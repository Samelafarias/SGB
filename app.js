// app.js
const { connectDB } = require('./config/db');
const { exibirMenu, perguntar, fecharTerminal } = require('./views/menu');
const LivroService = require('./services/livroService');
const UsuarioService = require('./services/usuarioService');
const EmprestimoService = require('./services/emprestimoService');
const RelatorioService = require('./services/relatorioService');

async function main() {
    try {
        await connectDB(); // Tenta conectar e criar tabelas

        let running = true;
        while (running) {
            exibirMenu();
            const escolha = await perguntar('Escolha uma opção: ');

            try {
                switch (escolha) {
                    case '1':
                        console.log('\n--- Cadastrar Livro ---');
                        const titulo = await perguntar('Título: ');
                        const autor = await perguntar('Autor: ');
                        const isbn = await perguntar('ISBN: ');
                        const anoPublicacao = parseInt(await perguntar('Ano de Publicação: '));
                        const quantidadeDisponivel = parseInt(await perguntar('Quantidade Disponível: '));
                        console.log(await LivroService.cadastrarLivro(titulo, autor, isbn, anoPublicacao, quantidadeDisponivel));
                        break;
                    case '2':
                        console.log('\n--- Cadastrar Usuário ---');
                        const nomeUsuario = await perguntar('Nome: ');
                        const matricula = await perguntar('Matrícula: ');
                        const curso = await perguntar('Curso: ');
                        console.log(await UsuarioService.cadastrarUsuario(nomeUsuario, matricula, curso));
                        break;
                    case '3':
                        console.log('\n--- Realizar Empréstimo ---');
                        const idLivroEmprestimo = parseInt(await perguntar('ID do Livro: '));
                        const idUsuarioEmprestimo = parseInt(await perguntar('ID do Usuário: '));
                        console.log(await EmprestimoService.realizarEmprestimo(idLivroEmprestimo, idUsuarioEmprestimo));
                        break;
                    case '4':
                        console.log('\n--- Realizar Devolução ---');
                        const idEmprestimoDevolucao = parseInt(await perguntar('ID do Empréstimo: '));
                        console.log(await EmprestimoService.realizarDevolucao(idEmprestimoDevolucao));
                        break;
                    case '5':
                        console.log('\n--- Relatórios ---');
                        console.log('1. Livros Emprestados');
                        console.log('2. Usuários com Empréstimos Atrasados');
                        console.log('3. Livros Disponíveis');
                        const escolhaRelatorio = await perguntar('Escolha um relatório: ');
                        switch (escolhaRelatorio) {
                            case '1':
                                const emprestados = await RelatorioService.listarLivrosEmprestados();
                                if (emprestados.length === 0) {
                                    console.log('Nenhum livro emprestado no momento.');
                                } else {
                                    console.log('\n--- Livros Emprestados ---');
                                    emprestados.forEach(e => {
                                        console.log(`ID Empréstimo: ${e.id} | Livro: ${e.livro_titulo} | Usuário: ${e.usuario_nome} | Data Empréstimo: ${e.data_emprestimo} | Prev. Devolução: ${e.data_prevista_devolucao}`);
                                    });
                                }
                                break;
                            case '2':
                                const atrasados = await RelatorioService.listarUsuariosComEmprestimosAtrasados();
                                if (atrasados.length === 0) {
                                    console.log('Nenhum empréstimo atrasado.');
                                } else {
                                    console.log('\n--- Empréstimos Atrasados ---');
                                    atrasados.forEach(e => {
                                        console.log(`ID Empréstimo: ${e.id} | Livro: ${e.livro_titulo} | Usuário: ${e.usuario_nome} | Prev. Devolução: ${e.data_prevista_devolucao}`);
                                    });
                                }
                                break;
                            case '3':
                                const disponiveis = await RelatorioService.listarLivrosDisponiveis();
                                if (disponiveis.length === 0) {
                                    console.log('Nenhum livro disponível no momento.');
                                } else {
                                    console.log('\n--- Livros Disponíveis ---');
                                    disponiveis.forEach(l => {
                                        console.log(`ID: ${l.id} | Título: ${l.titulo} | Autor: ${l.autor} | Quantidade: ${l.quantidade_disponivel}`);
                                    });
                                }
                                break;
                            default:
                                console.log('Opção de relatório inválida.');
                        }
                        break;
                    case '0':
                        running = false;
                        console.log('Saindo do sistema...');
                        break;
                    default:
                        console.log('Opção inválida. Tente novamente.');
                }
            } catch (error) {
                console.error(`Erro: ${error.message}`);
            }
            if (running) {
                await perguntar('Pressione Enter para continuar...');
            }
        }
    } catch (error) {
        console.error('Erro fatal ao iniciar o sistema:', error.message);
    } finally {
        fecharTerminal();
    }
}

main();