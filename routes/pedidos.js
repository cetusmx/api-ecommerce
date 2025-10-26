const express = require('express');
const router = express.Router();
const db = require('../models');
const Pedido = db.Pedido;

// Endpoint para crear una nueva pedido
router.post('/', async (req, res) => {
    try {
        const nuevoPedido = await Pedido.bulkCreate(req.body);
        res.status(201).json(nuevoPedido);
    } catch (error) {
        console.error('Error al crear el pedido:', error);
        res.status(400).json({ error: error.message });
    }
});

// Endpoint para obtener todos los pedidos
router.get('/', async (req, res) => {
    try {
        const pedidos = await Pedido.findAll();
        res.status(200).json(pedidos);
    } catch (error) {
        console.error('Error al obtener todos los pedidos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para obtener los pedidos de un cliente
router.get('/cliente/:email', async (req, res) => {
    try {
        const { email } = req.params;
        console.log('Fetching order with email:', email); // Add this line
        const pedido = await Pedido.findAll({
            where:
            {
                email: email,
            }
        });

        if (!pedido || pedido.length ===0) {
            //console.log('Order not found for folio:', folio); // Add this line
            return res.status(404).json({ error: 'Pedidos no encontrados' });
        }
        //console.log('Order found:', pedido); // Add this line
        res.status(200).json(pedido);
    } catch (error) {
        console.error('Error al obtener el pedido:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para obtener un pedido por su folio
router.get('/:folio', async (req, res) => {
    try {
        const { folio } = req.params;
        console.log('Fetching order with folio:', folio); // Add this line
        const pedido = await Pedido.findAll({
            where:
            {
                folio: folio,
            }
        });

        if (!pedido || pedido.length ===0) {
            console.log('Order not found for folio:', folio); // Add this line
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        //console.log('Order found:', pedido); // Add this line
        res.status(200).json(pedido);
    } catch (error) {
        console.error('Error al obtener el pedido:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para actualizar un pedido por su folio
router.put('/:folio', async (req, res) => {
    try {
        const { folio } = req.params;
        const [filasActualizadas, categoriaActualizada] = await Pedido.update(req.body, {
            where: { folio: folio },
            returning: true,
        });

        if (filasActualizadas === 0) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        res.status(200).json(categoriaActualizada[0]);
    } catch (error) {
        console.error('Error al actualizar el pedido:', error);
        res.status(400).json({ error: error.message });
    }
});

// Endpoint para eliminar un pedido por su folio
router.delete('/:folio', async (req, res) => {
    try {
        const { folio } = req.params;
        const pedidoEliminado = await Pedido.destroy({
            where: { folio: folio }
        });

        if (pedidoEliminado === 0) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        res.status(200).json({ message: 'Pedido eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar el pedido:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;