const express = require('express');
const router = express.Router();
const db = require('../models');
const Categoria = db.Categoria;

// Endpoint para crear una nueva categoría
router.post('/', async (req, res) => {
    try {
        const nuevaCategoria = await Categoria.create(req.body);
        res.status(201).json(nuevaCategoria);
    } catch (error) {
        console.error('Error al crear la categoría:', error);
        res.status(400).json({ error: error.message });
    }
});

// Endpoint para obtener todas las categorías
router.get('/', async (req, res) => {
    try {
        const categorias = await Categoria.findAll();
        res.status(200).json(categorias);
    } catch (error) {
        console.error('Error al obtener todas las categorías:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para obtener una categoría por su nombre
router.get('/:nombre', async (req, res) => {
    try {
        const { nombre } = req.params;
        const categoria = await Categoria.findByPk(nombre);

        if (!categoria) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.status(200).json(categoria);
    } catch (error) {
        console.error('Error al obtener la categoría:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para obtener categorías por categoría padre
router.get('/padre/:nombre_padre', async (req, res) => {
    try {
        const { nombre_padre } = req.params;
        const categorias = await Categoria.findAll({
            where: {
                categoria_padre: nombre_padre
            }
        });
        res.status(200).json(categorias);
    } catch (error) {
        console.error('Error al obtener las categorías por padre:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para actualizar una categoría por su nombre
router.put('/:nombre', async (req, res) => {
    try {
        const { nombre } = req.params;
        const [filasActualizadas, categoriaActualizada] = await Categoria.update(req.body, {
            where: { nombre: nombre },
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
router.delete('/:nombre', async (req, res) => {
    try {
        const { nombre } = req.params;
        const categoriaEliminada = await Categoria.destroy({
            where: { nombre: nombre }
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