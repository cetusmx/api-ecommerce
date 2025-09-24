const express = require('express');
const router = express.Router();
const db = require('../models');
const Carrito = db.Carrito;
const { Op } = require('sequelize');

// Endpoint para crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        // Usa `req.body` para acceder a los datos enviados en la solicitud
        const nuevoCarrito = await Carrito.create(req.body);
        res.status(201).json(nuevoCarrito);
    } catch (error) {
        console.error('Error al crear el carrito:', error);
        res.status(400).json({ error: error.message });
    }
});

// Endpoint para borrar un carrito por email
router.delete('/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const carritoBorrado = await Carrito.destroy({
            where: { email: email }
        });

        if (carritoBorrado === 0) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        res.status(200).json({ message: 'Carrito eliminado con éxito' });
    } catch (error) {
        console.error('Error al borrar el carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para obtener un carrito por email
router.get('/:email', async (req, res) => {
    console.log(req.params);
    try {
        const { email } = req.params;
        const carrito = await Carrito.findAll({
            where: {
                email: {
                    [Op.like]: `%${email}%` // Usamos Op.like para una búsqueda flexible
                }
            }
        });

        if (!carrito) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        res.status(200).json(carrito);
    } catch (error) {
        console.error('Error al obtener el carrito por email:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para obtener todos los carritos
router.get('/', async (req, res) => {
    try {
        const carritos = await Carrito.findAll();
        res.status(200).json(carritos);
    } catch (error) {
        console.error('Error al obtener todos los carritos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


module.exports = router;