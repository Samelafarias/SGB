const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function exibirMenu() {
    console.log('\n--- Sistema de Gestão de Biblioteca ---');
    console.log('1. Cadastrar Livro');
    console.log('2. Cadastrar Usuário');
    console.log('3. Realizar Empréstimo');
    console.log('4. Realizar Devolução');
    console.log('5. Relatórios');
    console.log('0. Sair');
    console.log('------------------------------------');
}

function perguntar(pergunta) {
    return new Promise(resolve => {
        rl.question(pergunta, resposta => {
            resolve(resposta.trim());
        });
    });
}

function fecharTerminal() {
    rl.close();
}

module.exports = { exibirMenu, perguntar, fecharTerminal };