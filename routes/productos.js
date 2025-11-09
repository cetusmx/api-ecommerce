const express = require('express');
const router = express.Router();
const db = require('../models');
const Producto = db.Producto;
const { Op } = require('sequelize');
const axios = require('axios');

// Endpoint para buscar productos por query en clave O descripcion
router.get('/search', async (req, res) => {
    // 1. Obtener la palabra clave de la URL
    const { query } = req.query;

    // 2. Validar que la query exista
    if (!query || typeof query !== 'string' || query.trim() === '') {
        return res.status(400).json({ 
            error: 'Debe proporcionar una palabra de búsqueda válida en el parámetro "query".' 
        });
    }

    // 3. Preparar la cadena de búsqueda para SQL LIKE
    // Usamos el símbolo '%' para indicar que la coincidencia puede estar en cualquier parte del campo.
    const searchString = `%${query.trim()}%`; 

    try {
        // 4. Ejecutar la búsqueda en Sequelize
        const productos = await Producto.findAll({
            where: {
                // Usar Op.or para buscar coincidencia en al menos uno de los campos
                [Op.or]: [
                    {
                        // Buscar en el campo 'clave'
                        clave: {
                            [Op.like]: searchString
                        }
                    },
                    {
                        // Buscar en el campo 'descripcion'
                        descripcion: {
                            [Op.like]: searchString
                        }
                    }
                ]
            },
            // Opcional: Limitar los campos para mejorar rendimiento (si no necesita todos)
            // attributes: ['clave', 'descripcion', 'linea', 'categoria', 'precio'], 
            order: [['clave', 'ASC']]
        });

        if (productos.length === 0) {
            return res.status(200).json({ message: 'No se encontraron productos que coincidan con la búsqueda.' });
        }
        console.log(productos.length);

        // 5. Devolver los resultados
        res.status(200).json(productos);

    } catch (error) {
        console.error('Error al realizar la búsqueda de productos:', error);
        res.status(500).json({ error: 'Error interno del servidor al buscar productos.' });
    }
});

router.post('/existencias-masiva', async (req, res) => {
    const claves = req.body.claves; 

    if (!Array.isArray(claves) || claves.length === 0) {
        return res.status(400).json({ error: 'El cuerpo debe contener un arreglo no vacío de claves de producto en el campo "claves".' });
    }

    const clavesNormalizadas = claves.map(c => String(c).trim().toUpperCase());

    try {
        // 1. Llamada al endpoint externo de inventario filtrado (index.js)
        const existenciasResponse = await axios.post(`${process.env.INVENTARIO_API_URL}/existencias-masiva-filtrada`, {
             claves: clavesNormalizadas 
        });

        const existenciasExternas = existenciasResponse.data;
        
        // 🚨 CAMBIO CLAVE: Usar un mapa para agrupar las existencias por clave
        // Mapa: Map<clave, Array< {almacen: N, existencia: X} >>
        const existenciasMap = new Map();
        
        // 2. Procesar y Agrupar por Clave
        existenciasExternas.forEach(e => {
            const claveNormalizada = String(e.CVE_ART).trim().toUpperCase();
            
            // Crea el objeto de existencia para el almacén actual
            const detalleExistencia = {
                almacen: String(e.CVE_ALM),
                existencia: parseFloat(e.EXIST || 0).toFixed(2)
            };
            
            // Agrupa la existencia por clave
            if (existenciasMap.has(claveNormalizada)) {
                existenciasMap.get(claveNormalizada).push(detalleExistencia);
            } else {
                existenciasMap.set(claveNormalizada, [detalleExistencia]);
            }
        });

        // 3. Formatear la Respuesta Final (asegurando que se devuelvan todas las claves solicitadas)
        const resultadoFinal = clavesNormalizadas.map(clave => ({
            clave: clave,
            // Si la clave existe en el mapa, devuelve el arreglo de almacenes. Si no, devuelve un arreglo vacío.
            existencias_por_almacen: existenciasMap.get(clave) || [] 
        }));

        res.status(200).json(resultadoFinal);

    } catch (error) {
        console.error('Error al obtener existencias masivas filtradas:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor al consultar existencias masivas.',
            detalle: error.message
        });
    }
});

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
/* router.patch('/existencias', async (req, res) => {
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
}); */

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

// Endpoint para obtener todos los productos (ORQUESTADOR - VERSIÓN ORIGINAL CON IVA Y REDONDEO)
router.get('/', async (req, res) => {
    try {
        // 1. Obtener la lista base de productos de la BD local ('y')
        // *EXCLUIMOS*: 'precio', 'existencia', 'ultima_compra', y 'ultimo_costo'
        const productosBase = await Producto.findAll({
            attributes: { exclude: ['precio', 'existencia', 'ultima_compra', 'ultimo_costo'] }
        });

        // 2. Realizar las TRES llamadas concurrentes al servidor 'z'
        const [preciosResponse, existenciasResponse, inventarioResponse] = await Promise.all([
            axios.get(`${process.env.INVENTARIO_API_URL}/precios`),
            axios.get(`${process.env.INVENTARIO_API_URL}/existencias`),
            axios.get(`${process.env.INVENTARIO_API_URL}/inventario`) 
        ]);

        // 3. Crear Mapas para una búsqueda eficiente O(1)
        const preciosExternos = preciosResponse.data;
        const existenciasExternas = existenciasResponse.data;
        const inventarioExterno = inventarioResponse.data; 

        // Mapa 1: Precios (CVE_ART -> PRECIO)
        const preciosMap = new Map();
        preciosExternos.forEach(p => {
            preciosMap.set(String(p.CVE_ART).trim().toUpperCase(), p.PRECIO);
        });

        // Mapa 2: Existencias (CVE_ART -> EXISTENCIA SUMADA)
        const existenciasMap = new Map();
        existenciasExternas.forEach(e => {
            const claveNormalizada = String(e.CVE_ART).trim().toUpperCase();
            const existenciaActual = existenciasMap.get(claveNormalizada) || 0;
            existenciasMap.set(claveNormalizada, existenciaActual + parseFloat(e.EXIST || 0));
        });
        
        // Mapa 3: Inventario Base (CVE_ART -> {FCH_ULTCOM, ULT_COSTO})
        const inventarioMap = new Map();
        inventarioExterno.forEach(i => {
            const claveNormalizada = String(i.CVE_ART).trim().toUpperCase();
            inventarioMap.set(claveNormalizada, {
                FCH_ULTCOM: i.FCH_ULTCOM,
                ULT_COSTO: i.ULT_COSTO,
                UNI_MED: i.UNI_MED,
            });
        });


        // 4. Fusionar los datos, aplicar IVA y construir la respuesta final
        const productosFinales = productosBase.map(producto => {
            const productoObj = producto.get({ plain: true });
            const claveNormalizada = String(productoObj.clave).trim().toUpperCase();
            
            // Datos Externos
            const invData = inventarioMap.get(claveNormalizada);
            
            // ----------------------------------------------------
            // 🚨 CAMBIO CLAVE: CÁLCULO DE IVA Y REDONDEO APLICADO
            // ----------------------------------------------------
            const precioNeto = preciosMap.has(claveNormalizada)
                ? parseFloat(preciosMap.get(claveNormalizada))
                : 0;

            let precioFinalVenta = null;

            if (precioNeto > 0) {
                // 1. Aplicar 16% de IVA (Precio Bruto)
                const precioBruto = precioNeto * 1.16;

                // 2. Aplicar reglas de redondeo
                if (precioBruto < 5.00) {
                    // Si es menor a $5.00, se mantiene a dos decimales
                    precioFinalVenta = parseFloat(precioBruto.toFixed(2));
                } else {
                    // Si es igual o mayor a $5.00, se redondea al entero superior
                    precioFinalVenta = Math.ceil(precioBruto);
                }
            }
            
            // Asignar el precio final de venta
            productoObj.precio = precioFinalVenta; 
            // ----------------------------------------------------
            
            // Integración de Existencia (original)
            productoObj.existencia = existenciasMap.has(claveNormalizada)
                ? parseFloat(existenciasMap.get(claveNormalizada))
                : 0.00;

            // Integración de los nuevos campos de Inventario Base (original)
            productoObj.ultimo_costo = invData && invData.ULT_COSTO
                ? parseFloat(invData.ULT_COSTO)
                : null;
            productoObj.ultima_compra = invData && invData.FCH_ULTCOM
                ? invData.FCH_ULTCOM
                : null; 

            return productoObj;
        });

        res.status(200).json(productosFinales);
    } catch (error) {
        console.error('Error al obtener productos y combinarlos con datos externos:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor al obtener o combinar datos.',
            detalle: error.message
        });
    }
});

// Endpoint para obtener un producto por su clave (AHORA CON UNA SOLA LLAMADA EXTERNA Y CÁLCULO DE PRECIO)
router.get('/:clave', async (req, res) => {
    const { clave } = req.params;
    const claveNormalizada = String(clave).trim().toUpperCase();
    //console.log("Dentro /:clave");
    try {
        // 1. Obtener el producto base de la BD local ('y')
        // *EXCLUIMOS*: los 4 campos que serán actualizados por la API externa.
        const productoBase = await Producto.findByPk(claveNormalizada, {
            attributes: { 
                exclude: ['precio', 'existencia', 'ultima_compra', 'ultimo_costo'] 
            }
        });

        if (!productoBase) {
            return res.status(404).json({ error: 'Producto no encontrado en la base de datos local.' });
        }
        
        // 2. Realizar UNA SOLA llamada al endpoint consolidado del servidor 'z'
        const inventarioCompletoResponse = await axios.get(
            `${process.env.INVENTARIO_API_URL}/inventariocompleto/${claveNormalizada}`
        );

        const invData = inventarioCompletoResponse.data; // Ya es el objeto directo
        const productoFinal = productoBase.get({ plain: true });

        // 3. Fusionar los datos actualizados y aplicar la lógica de precio
        
        // ----------------------------------------------------
        // 🚨 CÓDIGO CLAVE: CÁLCULO DE IVA Y REDONDEO APLICADO
        // ----------------------------------------------------
        const precioNeto = invData.PRECIO
            ? parseFloat(invData.PRECIO)
            : 0;

        let precioFinalVenta = null;

        if (precioNeto > 0) {
            // 1. Aplicar 16% de IVA (Precio Bruto)
            const precioBruto = precioNeto * 1.16;

            // 2. Aplicar reglas de redondeo
            if (precioBruto < 5.00) {
                // Si es menor a $5.00, se mantiene a dos decimales
                precioFinalVenta = parseFloat(precioBruto.toFixed(2));
            } else {
                // Si es igual o mayor a $5.00, se redondea al entero superior
                // Math.ceil() redondea al entero superior más cercano (ej. 5.01 -> 6, 5.00 -> 5)
                precioFinalVenta = Math.ceil(precioBruto);
            }
        }
        
        // Asignar el precio final de venta
        productoFinal.precio = precioFinalVenta; 
        // ----------------------------------------------------
        
        // EXISTENCIA
        productoFinal.existencia = invData.EXISTENCIA 
            ? parseFloat(invData.EXISTENCIA) 
            : 0.00;

        // ÚLTIMO COSTO
        productoFinal.ultimo_costo = invData.ULT_COSTO 
            ? parseFloat(invData.ULT_COSTO) 
            : null;

        // ÚLTIMA COMPRA
        productoFinal.ultima_compra = invData.FCH_ULTCOM || null;

        res.status(200).json(productoFinal);
    } catch (error) {
        // Manejo de errores
        console.error('Error al obtener el producto y combinar datos externos:', error.message);
        res.status(500).json({ 
            error: 'Error al procesar la solicitud o al conectar con el servicio de inventario en tiempo real.',
            detalle: error.message
        });
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