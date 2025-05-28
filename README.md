
# 📚 SGB - Sistema de Gestão de Biblioteca

Um sistema simples, funcional e monolítico para controle de empréstimos e devoluções em bibliotecas de pequeno porte. Desenvolvido em **JavaScript**, com interface HTML e armazenamento local via arquivos JSON, o SGB é ideal para ambientes offline e de baixo custo, como bibliotecas comunitárias ou escolares.

---

## 📖 Sumário

- [📚 Sobre o Projeto](#-sobre-o-projeto)  
- [✅ Funcionalidades](#-funcionalidades)  
- [⚙️ Tecnologias Utilizadas](#️-tecnologias-utilizadas)  
- [📂 Estrutura de Pastas](#-estrutura-de-pastas)  
- [🚀 Como Executar](#-como-executar)  
- [📊 Relatórios](#-relatórios)  
- [🧠 Justificativa Arquitetural](#-justificativa-arquitetural)  
- [📝 Licença](#-licença)

---

## 📚 Sobre o Projeto

O **Sistema de Gestão de Biblioteca (SGB)** foi criado para atender à demanda real de bibliotecas com recursos limitados, permitindo:

- Cadastro de livros e usuários.
- Registro e controle de empréstimos.
- Devolução e acompanhamento de prazos.
- Relatórios simples e úteis, como livros disponíveis e usuários com devoluções atrasadas.

---

## ✅ Funcionalidades

- 📘 **Cadastro de Livros**  
  Campos: título, autor, ISBN, ano, quantidade disponível.

- 👤 **Cadastro de Usuários**  
  Campos: nome, matrícula, curso.

- 🔄 **Empréstimo de Livros**  
  - Máximo de 3 livros por usuário.
  - Verificação de disponibilidade.
  - Registro de data de empréstimo e previsão de devolução.

- 📥 **Devolução de Livros**  
  - Atualização da quantidade disponível.
  - Registro de atraso, se aplicável.

- 📈 **Relatórios**  
  - Livros emprestados.  
  - Usuários com empréstimos atrasados.  
  - Livros disponíveis.

---

## ⚙️ Tecnologias Utilizadas

- **JavaScript** (ES6+)
- **HTML5**
- **CSS3**
- **Armazenamento local** via arquivos `.json` e `localStorage` JS
- Sem dependências externas no front-end

---

## 📂 Estrutura de Pastas

```
/biblioteca
│
├── dados/                  # Persistência de dados em JSON
│   ├── emprestimos.json
│   ├── livros.json
│   ├── usuarios.json
│   └── localStorage.js     # Gerencia leitura e escrita em JSON
│
├── interface/              # Interface do usuário (HTML + CSS + JS)
│   ├── login.html
│   ├── admin.html
│   ├── usuario.html
│   ├── login.css
│   ├── adm.css
│   ├── user.css
│   ├── style.css
│   └── menu.js             # Controla a navegação e interação do sistema
│
├── modelos/                # Modelos de dados
│   ├── Livros.js
│   ├── Usuario.js
│   └── Emprestimo.js
│
├── servicos/              # Lógica de negócios
│   └── bibliotecaService.js
│
├── main.js                # Script principal de inicialização
├── package.json
├── package-lock.json
└── .gitattributes
```

---

## 🚀 Como Executar

1. Clone este repositório:
   ```bash
   git clone https://github.com/seuusuario/sgb.git
   ```

2. Acesse a pasta do projeto:
   ```bash
   cd sgb/biblioteca
   ```

3. Abra o arquivo `login.html` com um navegador moderno.

> ✅ **Observação:** O sistema roda **offline** e não precisa de servidor ou instalação.

---

## 📊 Relatórios

A partir da tela administrativa (`admin.html`), o usuário pode:

- Listar todos os livros disponíveis.
- Ver usuários com devoluções atrasadas.
- Consultar livros atualmente emprestados.

---

## 🧠 Justificativa Arquitetural

Este projeto utiliza uma **arquitetura monolítica**, na qual todas as funcionalidades estão centralizadas em uma única base de código. Isso reduz complexidade e facilita a manutenção em contextos com pouca infraestrutura de TI.

- Sem backend separado.
- Interface e lógica de negócio integradas.
- Persistência local via JSON ou `localStorage`.

---

## 📝 Licença

Este projeto é de uso acadêmico e livre para fins educacionais.  
Sinta-se à vontade para estudar, adaptar e reutilizar conforme necessário.
