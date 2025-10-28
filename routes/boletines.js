const express = require('express');
const router = express.Router();
const db = require('../models');
const Boletin = db.Boletin;
const { Op } = require('sequelize');

// Endpoint para crear un nuevo Boletin
router.post('/', async (req, res) => {
    try {
        // Usa `req.body` para acceder a los datos enviados en la solicitud
        const nuevoBoletin = await Boletin.create(req.body);
        res.status(201).json(nuevoBoletin);
    } catch (error) {
        console.error('Error al crear el Boletin:', error);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;