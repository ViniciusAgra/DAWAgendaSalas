// FORAM FEITAS MUDANÇAS PARA ADEQUAÇÃO AO bdsas COM TABELAS "usuario" E "reserva" (03/12)

const { Router } = require('express');
const db = require('../db'); // Conexão com o banco de dados

const roteador = Router();

// Exibe o formulário de login
roteador.get('/login', (req, res) => {
    res.render('usuarios/login');
}); // ALTERADO NO login.ejs

// Realiza o logoff do usuário
roteador.get('/logoff', (req, res) => {
    req.session.destroy();
    res.redirect('/usuarios/login');
}); // Não precisa de alterações por enquanto.

// Exibe o formulário para criar um novo usuário
roteador.get('/novo', (req, res) => {
    res.render('usuarios/novo');
}); // ALTERADO NO novo.ejs

// Exibe as informações de um usuário específico (PERFIL??? PARA FAZER ISSO TENHO QUE PEGAR INFORMAÇÕES DA SESSION TALVEZ)
roteador.get('/:Prontuario', (req, res) => {
    const { Prontuario } = req.params;
    const sql = `
        SELECT * FROM usuario WHERE Prontuario = ?
    `;

    db.query(sql, [Prontuario], (err, resultados) => {
        if (err) throw err;
        console.log(resultados[0]);
        res.render('reservas/index', { reserva: resultados[0] });
    });
}); // ALTERADO NO perfil.ejs (creio que faltem alguns ajustes ainda)

// Exibe o formulário de edição de usuário
roteador.get('/:Prontuario/edit', (req, res) => {
    const { Prontuario } = req.params;
    const sql = 'SELECT * FROM usuario WHERE Prontuario = ?';
    db.query(sql, [Prontuario], (err, resultados) => {
        if (err) throw err;
        res.render('usuarios/edit', { reserva: resultados[0] });
    });
}); // ALTERADO NO edit.ejs

// Processa o login do usuário
roteador.post('/login', (req, res) => {
    const {prontuario, nome, senha} = req.body;

    const sql = `
                SELECT * FROM usuario
                WHERE Prontuario = ?
                AND Nome = ? AND Senha = ?
                LIMIT 1
    `;

    db.query(sql, [prontuario, nome, senha], (err, results)=>{
        if(err){
            return res.status(500).send('Erro ao fazer o login.');
        }

        console.log("Resultados da consulta:", results);
        req.session.login = false;
        if(results.length > 0){
            req.session.login = true;
            console.log("Login bem-sucedido. Sessão:", req.session.login);
            res.redirect('/reservas');
        }else{
            console.log("Falha no login. Dados não encontrados.");
            res.redirect('/usuarios/login');
        }
    });
}); // ALTERADO NO login.ejs

// Cria um novo usuário
roteador.post('/novo', (req, res) => {
    const { Prontuario, Nome, Senha } = req.body;
    const sqlCadastro = 'INSERT INTO usuario (Prontuario, Nome, Senha) VALUES (?, ?, ?)';

    db.query(sqlCadastro, [Prontuario, Nome, Senha], (err) => {
        if (err) throw err;
        res.redirect('/usuarios/login');
    });
}); // ALTERADO NO novo.ejs

// Deleta um usuário
roteador.delete('/:Prontuario', (req, res) => {
    const sql = 'DELETE FROM usuario WHERE Prontuario = ?';
    
    db.query(sql, [req.params.Prontuario], (err) => {
        if (err) throw err;
        res.redirect('/reservas');
    });
}); // Não precisa de uma view

module.exports = roteador;