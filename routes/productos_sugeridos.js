const express = require('express');
const router = express.Router();
const db = require('../models');
const ProductoSugerido = db.ProductoSugerido;
const { Op } = require('sequelize');

// Endpoint para crear un nuevo producto
router.post('/', async (req, res) => {
    try {
        // Usa `req.body` para acceder a los datos enviados en la solicitud
        const nuevoProducto = await ProductoSugerido.create(req.body);
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
        const productoBorrado = await ProductoSugerido.destroy({
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
        const productos = await ProductoSugerido.findAll();
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
        const producto = await ProductoSugerido.findByPk(clave);

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json(producto);
    } catch (error) {
        console.error('Error al obtener el producto por clave:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para obtener productos por línea
/* router.get('/linea/:linea', async (req, res) => {
    try {
        const { linea } = req.params;
        const productos = await ProductosSugeridos.findAll({
            where: {
                linea: {
                    [Op.like]: `%${linea}%` // Usamos Op.like para una búsqueda flexible
                }
            }
        });
        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al obtener los productos por línea:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}); */


module.exports = router;