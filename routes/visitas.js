const express = require('express');
const router = express.Router();
const db = require('../models');
const Visita = db.Visita;

// Middleware para obtener la dirección IP del cliente.
// Se recomienda usar un middleware o una función de utilidad para manejar
// la lógica de proxies (ej. Heroku, AWS, Nginx).
const getClientIp = (req) => {
    // Si estás detrás de un proxy, la IP real está en 'x-forwarded-for'
    // La IP del cliente puede ser una lista, se toma la primera.
    const forwardedIps = req.headers['x-forwarded-for'];
    if (forwardedIps) {
        return forwardedIps.split(',')[0].trim();
    }
    // Si no hay proxy, la IP está en req.connection.remoteAddress
    // O simplemente req.ip en Express
    return req.ip;
};


// Endpoint para registrar una nueva visita
router.post('/', async (req, res) => {
    try {
        const visitorIp = getClientIp(req);
        const datosVisita = {
            ...req.body,
            visitorIp: visitorIp,
        };

        const nuevaVisita = await Visita.create(datosVisita);
        res.status(201).json(nuevaVisita);
    } catch (error) {
        console.error('Error al registrar la visita:', error);
        // Validar si es un error de validación de Sequelize
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                error: 'Error de validación: Asegúrate de que todos los campos requeridos estén presentes y sean del tipo correcto.',
                details: error.errors.map(e => ({
                    field: e.path,
                    message: e.message
                }))
            });
        }
        res.status(500).json({ error: 'Error interno del servidor al registrar la visita.' });
    }
});

// Endpoint para obtener todas las visitas (opcional, útil para pruebas)
router.get('/', async (req, res) => {
    try {
        const visitas = await Visita.findAll();
        res.status(200).json(visitas);
    } catch (error) {
        console.error('Error al obtener las visitas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;