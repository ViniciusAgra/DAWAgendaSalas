// APARENTEMENTE CERTO PORQUE SOMENTE CONECTA COM O BANCO DE DADOS

// NECESSÁRIO CRIAR O BANCO TODA VEZ QUE FOR RODAR O CÓDIGO

const mysql = require('mysql');

// Configurações de conexão
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'aluno123', // ALTERAR SENHA CONFORME PC QUE ESTÁ
    
    // Não especificamos o database aqui para permitir a criação caso ele não exista
};

// Nome do banco de dados
const databaseName = 'dbsas';

// Função para criar o banco de dados, caso não exista
function createDatabaseIfNotExists(connection) {
    connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``, (err) => {
        if (err) {
            console.error('Erro ao tentar criar o banco de dados:', err.stack);
            return;
        }
        console.log(`Banco de dados '${databaseName}' garantido.`);
        
        // Após garantir que o banco existe, reconecte usando o databaseName
        connection.changeUser({ database: databaseName }, (err) => {
            if (err) {
                console.error('Erro ao alterar para o banco de dados:', err.stack);
                return;
            }
            console.log(`Conectado ao banco de dados '${databaseName}'`);
        });
    });
}

// Cria a conexão inicial
const connection = mysql.createConnection(dbConfig);

// Conecta e garante a criação do banco de dados
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err.stack);
        return;
    }
    console.log('Conectado ao MySQL.');

    // Verifica e cria o banco de dados se necessário
    createDatabaseIfNotExists(connection);
});

module.exports = connection;