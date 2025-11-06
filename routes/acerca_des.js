const express = require('express');
const router = express.Router();
const db = require('../models');
const AcercaDe = db.AcercaDe;
const { Op } = require('sequelize');

// Endpoint para crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        // Usa `req.body` para acceder a los datos enviados en la solicitud
        const nuevoAcercaDe = await AcercaDe.create(req.body);
        res.status(201).json(nuevoAcercaDe);
    } catch (error) {
        console.error('Error al crear el carrito:', error);
        res.status(400).json({ error: error.message });
    }
});

// Endpoint para obtener todos los perfiles
router.get('/', async (req, res) => {
    try {
        const acercade = await AcercaDe.findAll();
        res.status(200).json(acercade);
    } catch (error) {
        console.error('Error al obtener todos los acercade:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


module.exports = router;