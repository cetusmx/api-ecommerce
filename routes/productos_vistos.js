const express = require('express');
const router = express.Router();
const db = require('../models');
const ProductoVisto = db.ProductoVisto;
const { Op } = require('sequelize');

// Endpoint para obtener productos por email
router.get('/email/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const productos = await ProductoVisto.findAll({
            where: { email: email }
        });

        if (productos.length === 0) {
            return res.status(404).json({ error: 'No se encontraron productos para este email' });
        }

        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al obtener los productos por email:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para crear un nuevo producto
router.post('/', async (req, res) => {
    try {
        // Usa `req.body` para acceder a los datos enviados en la solicitud
        const nuevoProducto = await ProductoVisto.create(req.body);
        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error('Error al crear el producto sugerido:', error);
        res.status(400).json({ error: error.message });
    }
});

// Endpoint para borrar un producto por su clave
router.delete('/:clave', async (req, res) => {
    try {
        const { clave } = req.params;
        const productoBorrado = await ProductoVisto.destroy({
            where: { clave: clave }
        });

        if (productoBorrado === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json({ message: 'Producto eliminado con éxito' });
    } catch (error) {
        console.error('Error al borrar el producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const productos = await ProductoVisto.findAll();
        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al obtener todos los productos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para obtener un producto por su clave
router.get('/:clave', async (req, res) => {
    console.log(req.params);
    try {
        const { clave } = req.params;
        const producto = await ProductoVisto.findByPk(clave);

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json(producto);
    } catch (error) {
        console.error('Error al obtener el producto por clave:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;