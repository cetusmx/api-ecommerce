const express = require('express');
const router = express.Router();
const db = require('../models');
const LineaVendible = db.LineaVendible;

// Endpoint para crear una nueva linea vendible
router.post('/', async (req, res) => {
    try {
        const nuevaLineaVendible = await LineaVendible.create(req.body);
        res.status(201).json(nuevaLineaVendible);
    } catch (error) {
        console.error('Error al crear la linea vendible:', error);
        res.status(400).json({ error: error.message });
    }
});

// Endpoint para crear multiples lineas vendibles de forma masiva
router.post('/bulk', async (req, res) => {
    try {
        const lineasVendibles = await LineaVendible.bulkCreate(req.body);
        res.status(201).json(lineasVendibles);
    } catch (error) {
        console.error('Error al crear multiples lineas vendibles:', error);
        res.status(400).json({ error: error.message });
    }
});

// Endpoint para obtener todas las lineas vendibles
router.get('/', async (req, res) => {
    try {
        const lineasVendibles = await LineaVendible.findAll();
        res.status(200).json(lineasVendibles);
    } catch (error) {
        console.error('Error al obtener todas las lineas vendibles:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para obtener una linea vendible por su nombre
router.get('/:linea', async (req, res) => {
    try {
        const { linea } = req.params;
        const lineaVendible = await LineaVendible.findByPk(nombre);

        if (!lineaVendible) {
            return res.status(404).json({ error: 'Linea vendible no encontrada' });
        }
        res.status(200).json(lineaVendible);
    } catch (error) {
        console.error('Error al obtener la linea vendible:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para obtener prefijos por linea vendible
router.get('/prefijo/:linea', async (req, res) => {
    try {
        const { prefijo } = req.params;
        const lineasVendibles = await LineaVendible.findAll({
            where: {
                prefijo: prefijo
            }
        });
        res.status(200).json(lineasVendibles);
    } catch (error) {
        console.error('Error al obtener los prefijos de la linea vendible:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para actualizar una linea vendible por su campo linea
router.put('/:linea', async (req, res) => {
    try {
        const { linea } = req.params;
        const [filasActualizadas, lineaVendibleActualizada] = await LineaVendible.update(req.body, {
            where: { linea: linea },
            returning: true,
        });

        if (filasActualizadas === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.status(200).json(lineaVendibleActualizada[0]);
    } catch (error) {
        console.error('Error al actualizar la categoría:', error);
        res.status(400).json({ error: error.message });
    }
});

// Endpoint para eliminar una linea vendible por su linea
router.delete('/:linea', async (req, res) => {
    try {
        const { linea } = req.params;
        const lineaVendibleEliminada = await LineaVendible.destroy({
            where: { linea: linea }
        });

        if (lineaVendibleEliminada === 0) {
            return res.status(404).json({ error: 'Linea vendible no encontrada' });
        }
        res.status(200).json({ message: 'Linea vendible eliminada con éxito' });
    } catch (error) {
        console.error('Error al eliminar la linea vendible:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;