const express = require('express');
const router = express.Router();
const db = require('../models');
const Producto = db.Producto;
const { Op } = require('sequelize');

// Endpoint para crear un nuevo producto
router.post('/', async (req, res) => {
    try {
        // Usa `req.body` para acceder a los datos enviados en la solicitud
        const nuevoProducto = await Producto.create(req.body);
        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(400).json({ error: error.message });
    }
});

// Endpoint para actualizar las existencias de uno o varios productos de forma masiva
router.patch('/existencias', async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const productosActualizados = req.body;
        if (!Array.isArray(productosActualizados) || productosActualizados.length === 0) {
            return res.status(400).json({ error: 'El cuerpo de la solicitud debe ser un arreglo no vacío de productos.' });
        }

        const clavesRecibidas = productosActualizados.map(p => p.clave);
        const productosExistentes = await Producto.findAll({
            attributes: ['clave'],
            where: {
                clave: {
                    [db.Sequelize.Op.in]: clavesRecibidas
                }
            },
            transaction: t
        });

        const clavesExistentes = new Set(productosExistentes.map(p => p.clave));
        const productosParaActualizar = [];
        const productosNoEncontrados = [];

        productosActualizados.forEach(p => {
            if (clavesExistentes.has(p.clave)) {
                productosParaActualizar.push(p);
            } else {
                productosNoEncontrados.push(p.clave);
            }
        });

        let updatedCount = 0;
        if (productosParaActualizar.length > 0) {
            for (const p of productosParaActualizar) {
                const [filasActualizadas] = await Producto.update(
                    { existencia: p.existencia },
                    { where: { clave: p.clave }, transaction: t }
                );
                if (filasActualizadas > 0) {
                    updatedCount++;
                }
            }
        }

        await t.commit();
        let message = `Proceso de actualización de existencias completado. Se actualizaron ${updatedCount} productos.`;

        if (productosNoEncontrados.length > 0) {
            message += ` ${productosNoEncontrados.length} productos no encontrados: ${productosNoEncontrados.join(', ')}.`;
        }

        res.status(200).json({
            message: message,
            productosNoEncontrados: productosNoEncontrados
        });

    } catch (error) {
        await t.rollback();
        console.error('Error al actualizar existencias de forma masiva:', error);
        res.status(500).json({ error: 'Error interno del servidor al actualizar existencias.' });
    }
});

// Endpoint para obtener todas las categorías únicas de productos
router.get('/categorias', async (req, res) => {
    try {
        const categorias = await Producto.findAll({
            attributes: [
                [db.sequelize.fn('DISTINCT', db.sequelize.col('categoria')), 'categoria']
            ],
            group: ['categoria'],
            order: [
                ['categoria', 'ASC']
            ]
        });
        const listaCategorias = categorias.map(c => c.categoria);
        res.status(200).json(listaCategorias);
    } catch (error) {
        console.error('Error al obtener categorías únicas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para borrar un producto por su clave
router.delete('/:clave', async (req, res) => {
    try {
        const { clave } = req.params;
        const productoBorrado = await Producto.destroy({
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

// Endpoint para borrar todos los productos
router.delete('/all', async (req, res) => {
    try {
        await Producto.destroy({
            where: {},
            truncate: true
        });
        res.status(200).json({ message: 'Todos los productos han sido eliminados con éxito' });
    } catch (error) {
        console.error('Error al eliminar todos los productos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const productos = await Producto.findAll();
        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al obtener todos los productos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para obtener un producto por su clave
router.get('/:clave', async (req, res) => {
    try {
        const { clave } = req.params;
        const producto = await Producto.findByPk(clave);

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
router.get('/linea/:linea', async (req, res) => {
    try {
        const { linea } = req.params;
        const productos = await Producto.findAll({
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
});

// Endpoint para crear multiples productos de forma masiva
router.post('/bulk', async (req, res) => {
    try {
        const productos = await Producto.bulkCreate(req.body);
        res.status(201).json(productos);
    } catch (error) {
        console.error('Error al crear multiples productos:', error);
        res.status(400).json({ error: error.message });
    }
});

// Endpoint para actualizar el precio de un producto por su clave
router.patch('/precio', async (req, res) => {
    try {
        const { clave, precio } = req.body;

        if (!clave || precio === undefined) {
            return res.status(400).json({ error: 'Faltan campos obligatorios: clave y precio' });
        }

        const [filasActualizadas] = await Producto.update(
            { precio: precio },
            { where: { clave: clave } }
        );

        if (filasActualizadas === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const productoActualizado = await Producto.findByPk(clave);
        res.status(200).json(productoActualizado);
    } catch (error) {
        console.error('Error al actualizar el precio del producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para actualizar el precio de multiples productos de forma masiva
router.patch('/bulk-precio', async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const productosActualizados = req.body;
        if (!Array.isArray(productosActualizados) || productosActualizados.length === 0) {
            return res.status(400).json({ error: 'El cuerpo de la solicitud debe ser un arreglo no vacío de productos.' });
        }

        const clavesRecibidasNormalizadas = productosActualizados.map(p =>
            String(p.clave).trim().toUpperCase());
        console.log('Claves recibidas normalizadas:', clavesRecibidasNormalizadas); // DEBUG

        const productosExistentes = await Producto.findAll({
            attributes: ['clave'],
            where: {
                clave: {
                    [db.Sequelize.Op.in]: clavesRecibidasNormalizadas
                }
            },
            transaction: t
        });

        const clavesExistentesNormalizadas = new Set(productosExistentes.map(p =>
            String(p.clave).trim().toUpperCase()));
        console.log('Claves existentes en DB (normalizadas):',
            Array.from(clavesExistentesNormalizadas)); // DEBUG

        const productosParaActualizar = [];
        const productosNoEncontrados = [];

        productosActualizados.forEach(p => {
            const claveNormalizada = String(p.clave).trim().toUpperCase();
            if (clavesExistentesNormalizadas.has(claveNormalizada)) {
                productosParaActualizar.push({
                    clave: claveNormalizada, precio: p.precio
                });
            } else {
                productosNoEncontrados.push(p.clave);
            }
        });

        console.log('Productos para actualizar (claves normalizadas):',
            productosParaActualizar.map(p => p.clave)); // DEBUG
        console.log('Productos no encontrados:', productosNoEncontrados); // DEBUG

        let message = 'Proceso de actualización de precios completado.';
        let updatedCount = 0;

        if (productosParaActualizar.length > 0) {
            // Realizar la actualización individual para cada producto existente
            for (const p of productosParaActualizar) {
                const [filasActualizadas] = await Producto.update(
                    { precio: p.precio },
                    { where: { clave: p.clave }, transaction: t }
                );
                if (filasActualizadas > 0) {
                    updatedCount++;
                }
            }
            message += `Se actualizaron ${updatedCount} productos.`;
        } else {
            message += ' No se encontraron productos existentes para actualizar.';
        }

        if (productosNoEncontrados.length > 0) {
            message += `${productosNoEncontrados.length} productos no encontrados:
  ${productosNoEncontrados.join(', ')}.`;
        }

        await t.commit();
        res.status(200).json({
            message: message, productosNoEncontrados:
                productosNoEncontrados
        });

    } catch (error) {
        await t.rollback();
        console.error('Error al actualizar precios de forma masiva:', error);
        res.status(500).json({ error: 'Error interno del servidor al actualizar precios.' });
    }
});

module.exports = router;