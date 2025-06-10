const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',      
    user: 'root',          
    password: '',           
    database: 'biblioteca_db' 
};

let connection;

async function connectDB() {
    try {
        if (!connection || connection.state === 'disconnected') {
            connection = await mysql.createConnection(dbConfig);
            console.log('Conectado ao banco de dados MySQL/MariaDB!');
            await createTables(); 
        }
        return connection;
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error.message);
        process.exit(1); 
    }
}

async function createTables() {
    const conn = await connection;
    await conn.execute(`
        CREATE TABLE IF NOT EXISTS livros (
            id INT AUTO_INCREMENT PRIMARY KEY,
            titulo VARCHAR(255) NOT NULL,
            autor VARCHAR(255) NOT NULL,
            isbn VARCHAR(20) UNIQUE NOT NULL,
            ano_publicacao INT NOT NULL,
            quantidade_disponivel INT NOT NULL DEFAULT 0
        );
    `);
    await conn.execute(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(255) NOT NULL,
            matricula VARCHAR(50) UNIQUE NOT NULL,
            curso VARCHAR(255) NOT NULL
        );
    `);
    await conn.execute(`
        CREATE TABLE IF NOT EXISTS emprestimos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            livro_id INT NOT NULL,
            usuario_id INT NOT NULL,
            data_emprestimo DATE NOT NULL,
            data_prevista_devolucao DATE NOT NULL,
            data_devolucao DATE NULL,
            status VARCHAR(50) NOT NULL DEFAULT 'emprestado',
            FOREIGN KEY (livro_id) REFERENCES livros(id) ON DELETE CASCADE,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
        );
    `);
    console.log('Tabelas verificadas/criadas no banco de dados.');
}

module.exports = { connectDB }; 