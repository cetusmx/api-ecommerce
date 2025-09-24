const express = require('express');
const router = express.Router();
const db = require('../models');
const ProductoPromocion = db.ProductoPromocion;
const { Op } = require('sequelize');

// Endpoint para crear un nuevo producto
router.post('/', async (req, res) => {
    try {
        // Usa `req.body` para acceder a los datos enviados en la solicitud
        const nuevoProducto = await ProductoPromocion.create(req.body);
        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error('Error al crear el producto promoción:', error);
        res.status(400).json({ error: error.message });
    }
});

// Endpoint para borrar un producto por su clave
router.delete('/:clave', async (req, res) => {
    try {
        const { clave } = req.params;
        const productoBorrado = await ProductoPromocion.destroy({
            where: { clave: clave }
        });

        if (productoBorrado === 0) {
            return res.status(404).json({ error: 'Producto en promoción no encontrado' });
        }

        res.status(200).json({ message: 'Producto eliminado con éxito' });
    } catch (error) {
        console.error('Error al borrar el producto en promoción:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const productos = await ProductoPromocion.findAll();
        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al obtener todos los productos en promoción:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;