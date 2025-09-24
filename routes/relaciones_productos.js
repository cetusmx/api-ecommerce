const express = require('express');
const router = express.Router();
const db = require('../models');
const RelacionProducto = db.RelacionProducto;

// Endpoint para crear una nueva categoría
router.post('/', async (req, res) => {
    try {
        const nuevaCategoria = await RelacionProducto.create(req.body);
        res.status(201).json(nuevaCategoria);
    } catch (error) {
        console.error('Error al crear la categoría:', error);
        res.status(400).json({ error: error.message });
    }
});

// Endpoint para obtener todas las categorías
router.get('/', async (req, res) => {
    try {
        const categorias = await RelacionProducto.findAll();
        res.status(200).json(categorias);
    } catch (error) {
        console.error('Error al obtener todas las categorías:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para obtener una categoría por su nombre
router.get('/:categoria', async (req, res) => {
    try {
        const { categoria } = req.params;
        const nombre = await RelacionProducto.findByPk(categoria);

        if (!nombre) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.status(200).json(nombre);
    } catch (error) {
        console.error('Error al obtener la categoría:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para actualizar una categoría por su nombre
router.put('/:categoria', async (req, res) => {
    try {
        const { categoria } = req.params;
        const [filasActualizadas, categoriaActualizada] = await RelacionProducto.update(req.body, {
            where: { categoria: categoria },
            returning: true,
        });

        if (filasActualizadas === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.status(200).json(categoriaActualizada[0]);
    } catch (error) {
        console.error('Error al actualizar la categoría:', error);
        res.status(400).json({ error: error.message });
    }
});

// Endpoint para eliminar una categoría por su nombre
router.delete('/:categoria', async (req, res) => {
    try {
        const { categoria } = req.params;
        const categoriaEliminada = await RelacionProducto.destroy({
            where: { categoria: categoria }
        });

        if (categoriaEliminada === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.status(200).json({ message: 'Categoría eliminada con éxito' });
    } catch (error) {
        console.error('Error al eliminar la categoría:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;