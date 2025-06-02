// Conteúdo de main.js

import { autenticarUsuario } from './servicos/bibliotecaService.js'; // Importa a função de autenticação

document.getElementById("loginForm").addEventListener("submit", async function(e) { // Adicionado 'async' aqui
  e.preventDefault();
  const matricula = document.getElementById("matricula").value;
  const senha = document.getElementById("senha").value;

    try {
        const usuario = await autenticarUsuario(matricula, senha); // Chama a nova função

        if (usuario) {
            localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
            if (usuario.tipo === "admin") {
                window.location.href = "admin.html";
            } else {
                window.location.href = "usuario.html";
            }
        } else {
            alert("Usuário ou senha inválidos.");
        }
    } catch (error) {
        console.error("Erro durante o login:", error);
        alert("Ocorreu um erro ao tentar fazer login. Tente novamente.");
    }
});

