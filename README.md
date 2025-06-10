
# 📚 SGB - Sistema de Gestão de Biblioteca

Um sistema simples, funcional e monolítico para controle de empréstimos e devoluções em bibliotecas de pequeno porte. Desenvolvido em JavaScript (Node.js) e utilizando MySQL/MariaDB para armazenamento de dados, o SGB é ideal para ambientes offline (com banco de dados local) e de baixo custo, como bibliotecas comunitárias ou escolares.

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

- **JavaScript** (Node - ES6+)
- **MySQL/MariaDB**(Como banco de dados)
--`mysql2`(drive Node.js para MySQL/MariaDB)
- **Interface via terminal** (usando readline)

---

## 📂 Estrutura de Pastas

```
/SGB
│
├── config/                 # Configurações do banco de dados
│   └── db.js               # Conexão e criação de tabelas MySQL/MariaDB
│
├── models/                 # Modelos de dados e interação direta com o DB
│   ├── Livro.js
│   ├── Usuario.js
│   └── Emprestimo.js
│
├── services/               # Lógica de negócios e regras do sistema
│   ├── livroService.js
│   ├── usuarioService.js
│   ├── emprestimoService.js
│   └── relatorioService.js
│
├── utils/                  # Funções utilitárias (ex: manipulação de datas)
│   └── dateUtils.js
│
├── views/                  # Funções para exibir o menu e interagir com o usuário no terminal
│   └── menu.js
│
├── app.js                  # Arquivo principal para iniciar o sistema
├── package.json            # Gerenciamento de dependências do Node.js
└── package-lock.json
```

---

## 🚀 Como Executar

Para colocar o SGB em funcionamento, siga os passos abaixo:

1. Instale o Node.js: Certifique-se de ter o Node.js (versão 16.x ou superior) instalado em sua máquina.

2. Instale e Inicie o MySQL/MariaDB (via XAMPP)
 - Baixe e instale o XAMPP 
 - Após a instalação, inicie os módulos Apache e MySQL/MariaDB através do painel de controle do XAMPP.
 - Crie o Banco de Dados: Conecte-se ao seu MySQL/MariaDB (pelo PHPMyAdmin do XAMPP, MySQL Workbench, ou extensão Database Client do VS Code) e execute o seguinte comando SQL:
 `CREATE DATABASE IF NOT EXISTS biblioteca_db;
 USE biblioteca_db;
 `

3. Acesse a Pasta do Projeto:

 - Abra o terminal na pasta raiz do projeto SGB.

4. Execute o Sistema:
 - Basta rodar um único comando para instalar as dependências e iniciar o sistema:
 `
 npm start ou node app.js
 `

---

## 📊 Relatórios

Através da opção de relatórios no menu principal, o usuário pode:

- Listar todos os livros disponíveis.
- Ver usuários com devoluções atrasadas.
- Consultar livros atualmente emprestados.

---

## 🧠 Justificativa Arquitetural

Este projeto adota uma arquitetura monolítica, onde todas as funcionalidades – a camada de interface (terminal), a lógica de negócios e a persistência de dados (MySQL/MariaDB) – estão contidas e executadas como uma única aplicação.

A escolha por essa arquitetura foi motivada pela necessidade de um sistema:

- Simples e Direto: Fácil de desenvolver, testar e implantar para um contexto de baixo custo e sem equipe de TI dedicada.
- Monolítico: Atende ao requisito de um programa autocontido, sem a complexidade de múltiplos serviços ou microsserviços.
- Manutenção Simplificada: A base de código unificada facilita a compreensão e a alteração do sistema como um todo.

---

## 📝 Licença

Este projeto é de uso acadêmico e livre para fins educacionais.  
Sinta-se à vontade para estudar, adaptar e reutilizar conforme necessário.
