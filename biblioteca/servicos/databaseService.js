// servicos/databaseService.js ou dados/dbService.js
import initSqlJs from 'sql.js';

let db = null; 


export async function initializeDatabase() {
    if (db) {
        console.log("Banco de dados já inicializado.");
        return db; 
    }

    try {
        const SQL = await initSqlJs({

            locateFile: file => `../node_modules/sql.js/dist/${file}` 
        });

        const storedDbData = localStorage.getItem('library_db'); 
        if (storedDbData) {
            console.log("Carregando banco de dados do localStorage...");
            const buffer = JSON.parse(storedDbData);
            db = new SQL.Database(new Uint8Array(buffer));
        } else {
            console.log("Criando novo banco de dados...");
            db = new SQL.Database();
            createTables(); 
        }

        console.log("Banco de dados SQLite inicializado com sucesso!");
        return db;

    } catch (err) {
        console.error("Erro ao inicializar o banco de dados SQLite:", err);
        throw err;
    }
}

function createTables() {
    try {
        db.run(`
            CREATE TABLE IF NOT EXISTS livros (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                titulo TEXT NOT NULL,
                autor TEXT NOT NULL,
                isbn TEXT UNIQUE NOT NULL,
                anoPublicacao INTEGER,
                quantidadeDisponivel INTEGER NOT NULL DEFAULT 0
            );
        `);
        db.run(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                matricula TEXT UNIQUE NOT NULL,
                senha TEXT NOT NULL, -- Adicionado senha com base no main.js
                tipo TEXT NOT NULL DEFAULT 'comum' -- Adicionado tipo (admin/comum)
            );
        `);
        db.run(`
            CREATE TABLE IF NOT EXISTS emprestimos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuarioId INTEGER NOT NULL,
                livroId INTEGER NOT NULL,
                dataEmprestimo TEXT NOT NULL,
                dataPrevistaDevolucao TEXT NOT NULL,
                dataDevolucao TEXT, -- Pode ser NULL se o livro ainda não foi devolvido
                atrasado INTEGER DEFAULT 0, -- 0 para não atrasado, 1 para atrasado
                FOREIGN KEY (usuarioId) REFERENCES usuarios(id),
                FOREIGN KEY (livroId) REFERENCES livros(id)
            );
        `);
        console.log("Tabelas (livros, usuarios, emprestimos) criadas ou já existentes.");
    } catch (err) {
        console.error("Erro ao criar tabelas:", err);
    }
}

export function saveDatabase() {
    if (db) {
        try {
            const data = db.export(); 
            const buffer = new Uint8Array(data);
            localStorage.setItem('library_db', JSON.stringify(Array.from(buffer)));
            console.log("Banco de dados salvo no localStorage.");
        } catch (err) {
            console.error("Erro ao salvar o banco de dados:", err);
        }
    }
}


export async function insertLivro(livro) {
    await initializeDatabase(); 
    db.run("INSERT INTO livros (titulo, autor, isbn, anoPublicacao, quantidadeDisponivel) VALUES (?, ?, ?, ?, ?)",
        [livro.titulo, livro.autor, livro.isbn, livro.anoPublicacao, livro.quantidade]); 
    saveDatabase();
}

export async function getLivros(filter = {}) {
    await initializeDatabase();
    let query = "SELECT * FROM livros";
    let params = [];
    if (filter.disponiveis) {
        query += " WHERE quantidadeDisponivel > 0";
    }
    const res = db.exec(query, params);
    if (res.length === 0) return [];
    return res[0].values.map(row => {
        const obj = {};
        res[0].columns.forEach((col, idx) => {
            obj[col] = row[idx];
        });
        return obj;
    });
}

export async function updateLivroQuantidade(livroId, novaQuantidade) {
    await initializeDatabase();
    db.run("UPDATE livros SET quantidadeDisponivel = ? WHERE id = ?", [novaQuantidade, livroId]);
    saveDatabase();
}

export async function getLivroById(livroId) {
    await initializeDatabase();
    const res = db.exec("SELECT * FROM livros WHERE id = ?", [livroId]);
    if (res.length === 0) return null;
    const row = res[0].values[0];
    const obj = {};
    res[0].columns.forEach((col, idx) => {
        obj[col] = row[idx];
    });
    return obj;
}



export async function insertUsuario(usuario) {
    await initializeDatabase();

    db.run("INSERT INTO usuarios (nome, matricula, senha, tipo) VALUES (?, ?, ?, ?)",
        [usuario.nome, usuario.matricula, usuario.senha, usuario.tipo || 'comum']); 
    saveDatabase();
}

export async function getUsuarioByMatriculaSenha(matricula, senha) {
    await initializeDatabase();
    const res = db.exec("SELECT * FROM usuarios WHERE matricula = ? AND senha = ?", [matricula, senha]);
    if (res.length === 0) return null;
    const row = res[0].values[0];
    const obj = {};
    res[0].columns.forEach((col, idx) => {
        obj[col] = row[idx];
    });
    return obj;
}

export async function getUsuarioById(usuarioId) {
    await initializeDatabase();
    const res = db.exec("SELECT * FROM usuarios WHERE id = ?", [usuarioId]);
    if (res.length === 0) return null;
    const row = res[0].values[0];
    const obj = {};
    res[0].columns.forEach((col, idx) => {
        obj[col] = row[idx];
    });
    return obj;
}

export async function insertEmprestimo(emprestimo) {
    await initializeDatabase();
    db.run("INSERT INTO emprestimos (usuarioId, livroId, dataEmprestimo, dataPrevistaDevolucao, atrasado) VALUES (?, ?, ?, ?, ?)",
        [emprestimo.usuarioId, emprestimo.livroId, emprestimo.dataEmprestimo, emprestimo.dataPrevistaDevolucao, emprestimo.atrasado || 0]);
    saveDatabase();
}

export async function getEmprestimos(filter = {}) {
    await initializeDatabase();
    let query = "SELECT * FROM emprestimos";
    let params = [];
    if (filter.naoDevolvidos) {
        query += " WHERE dataDevolucao IS NULL";
    }
    if (filter.atrasados) {
        query += " WHERE atrasado = 1 AND dataDevolucao IS NULL";
    }
    const res = db.exec(query, params);
    if (res.length === 0) return [];
    return res[0].values.map(row => {
        const obj = {};
        res[0].columns.forEach((col, idx) => {
            obj[col] = row[idx];
        });
        return obj;
    });
}

export async function updateEmprestimoDevolucao(emprestimoId, dataDevolucao, atrasado) {
    await initializeDatabase();
    db.run("UPDATE emprestimos SET dataDevolucao = ?, atrasado = ? WHERE id = ?", [dataDevolucao, atrasado, emprestimoId]);
    saveDatabase();
}

export async function getEmprestimoById(emprestimoId) {
    await initializeDatabase();
    const res = db.exec("SELECT * FROM emprestimos WHERE id = ?", [emprestimoId]);
    if (res.length === 0) return null;
    const row = res[0].values[0];
    const obj = {};
    res[0].columns.forEach((col, idx) => {
        obj[col] = row[idx];
    });
    return obj;
}

export { db };