// main.js
document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const matricula = document.getElementById("matricula").value;
  const senha = document.getElementById("senha").value;

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuario = usuarios.find(u => u.matricula === matricula && u.senha === senha);

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
});
