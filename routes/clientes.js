const express = require('express');
const router = express.Router();
const { Cliente } = require('../models');

// Endpoint para obtener todos los clientes
router.get('/', async (req, res) => {
    try {
        const clientes = await Cliente.findAll();
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para crear un nuevo cliente
router.post('/', async (req, res) => {
    try {
        const nuevoCliente = await Cliente.create(req.body);
        res.status(201).json(nuevoCliente);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;