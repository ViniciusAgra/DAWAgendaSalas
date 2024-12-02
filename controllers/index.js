// ALTERADO PARA SE ADEQUAR À PROPOSTA DO PROJETO

const reservasController = require('./reservasController');
const usersController = require('./usersController');

controllers = {
    reservas: reservasController,
    users: usersController
}

module.exports = controllers;