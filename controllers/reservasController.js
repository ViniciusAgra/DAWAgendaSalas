// FORAM FEITAS MUDANÇAS PARA ADEQUAÇÃO AO bdsas COM TABELAS "usuario" E "reserva"

// PRECISA DE REVISÃO GERAL

const { Router } = require('express');
const db = require('../db'); // importa a conexão com o banco


const roteador = Router();

// CRUD - Create, Read, Update, Destroy (em REST)

// Listar reservas
roteador.get('/', (req, res) => {
    const sql = `
        SELECT reserva.*, usuario.Nome
        FROM reserva
        JOIN usuario ON reserva.Professor = usuario.Prontuario
    `;
    db.query(sql, (err, resultados) => {
        if (err) throw err;
        res.render('reservas/index', { reservas: resultados });
    });
}); // ALTERADO EM index.ejs
    
// Formulário para nova reserva
roteador.get('/nova', (req, res) => {
    res.render('reservas/nova');
}); // ALTERADO EM nova.ejs

// Visualizar reserva específica
roteador.get('/:ID_Reserva', (req, res) => {
    const { ID_Reserva } = req.params;
    const sql = `
        SELECT reserva.*, usuario.Nome
        FROM reserva
        JOIN usuario ON reserva.Professor = usuario.Prontuario
        WHERE reserva.ID_Reserva = ?
    `;

    db.query(sql, [ID_Reserva], (err, resultados) => {
        if (err) throw err;
        console.log(resultados[0]);
        res.render('reservas/index', { reserva: resultados[0] });
    });
}); // ALTERADO EM inforeserva.ejs

// Formulário para editar reserva
roteador.get('/:ID_Reserva/edit', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM reserva WHERE ID_Reserva = ?';
    db.query(sql, [id], (err, resultados) => {
        if (err) throw err;
        res.render('reservas/edit', { reserva: resultados[0] });
    });
}); // ALTERADO EM edit.ejs

// Criar nova reserva
roteador.post('/', (req, res) => {
    const { Nome, reserva } = req.body;
    const sqlUsuario = 'SELECT Prontuario FROM usuario WHERE Nome = ?';
    
    db.query(sqlUsuario, [Nome], (err, resultados) => {
        if (err) throw err;

        if (resultados.length === 0) {
            res.send('<h1>Usuário não encontrado</h1>');
        } else {
            const usuarioProntuario = resultados[0].Prontuario;
            const sqlReserva = 'INSERT INTO reserva (Sala, Curso, Dia, Professor, Inicio, Fim, Descricao) VALUES (?, ?, ?, ?, ?, ?, ?)';

            db.query(sqlReserva, [reserva, usuarioProntuario], (err) => { //???DUVIDA
                if (err) throw err;
                res.redirect('/reservas');
            });
        }
    });
}); //ALTERADO EM nova.ejs

// Atualizar reserva
// Aparentemente esse trecho está errado porque só permite a atualização somente se TODOS OS CAMPOS forem alterados.

roteador.patch('/:ID_Reserva', (req, res) => {
    const { Sala, Curso, Dia, Professor, Inicio, Fim, Descricao } = req.body;
    const sql = 'UPDATE reserva SET Sala = ?, Curso = ?, Dia = ?, Professor = ?, Inicio = ?, Fim = ?, Descricao = ? WHERE ID_Reserva = ?';
    
    db.query(sql, [Sala, Curso, Dia, Professor, Inicio, Fim, Descricao, req.params.ID_Reserva], (err) => {
        if (err) throw err;
        res.redirect('/reservas');
    });
}); // PRECISA DE REVISÃO

/*Segue abaixo a solução dada pelo ChatGPT:

roteador.patch('/:ID_Reserva', (req, res) => {
    const { Sala, Curso, Periodo, Dia, Professor, Professor_2, Inicio, Fim, Descricao } = req.body;

    // Objeto para armazenar os campos que precisam ser atualizados
    const updates = {};
    if (Sala) updates.Sala = Sala;
    if (Curso) updates.Curso = Curso;
    if (Dia) updates.Dia = Dia;
    if (Professor) updates.Professor = Professor;
    if (Inicio) updates.Inicio = Inicio;
    if (Fim) updates.Fim = Fim;
    if (Descricao) updates.Descricao = Descricao;

    // Gerar dinamicamente a query SQL
    const fields = Object.keys(updates).map(field => `${field} = ?`).join(', ');
    const values = Object.values(updates);

    // Adicionar o ID_Reserva no final da lista de valores
    values.push(req.params.ID_Reserva);

    const sql = `UPDATE reserva SET ${fields} WHERE ID_Reserva = ?`;

    // Executar a query no banco
    db.query(sql, values, (err) => {
        if (err) throw err;
        res.redirect('/reservas');
    });
});

*/

// Deletar reserva
roteador.delete('/:ID_Reserva', (req, res) => {
    const sql = 'DELETE FROM reserva WHERE ID_Reserva = ?';
    
    db.query(sql, [req.params.ID_Reserva], (err) => {
        if (err) throw err;
        res.redirect('/reservas');
    });
}); // Não precisa de view

module.exports = roteador;