// Importar utilidades necesarias
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const db = require('../models');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const Envio = db.Envio;
// Necesitas el modelo EnvioProducto para las partidas
const EnvioProducto = db.EnvioProducto;
const axios = require('axios');

// ⚠️ CONFIGURACIÓN DE NODEMAILER (Asegúrate que estas credenciales sean válidas)
// Asumo que ya tienes esta configuración al inicio del archivo
const transporter = nodemailer.createTransport({
    host: "mail.sealmarket.mx",
    port: 465,
    secure: true,
    auth: {
        user: "auto-confirm@sealmarket.mx", // O la cuenta que uses para enviar
        pass: "Trof#4102O"
    }
});

// Importar la nueva plantilla (Ajusta la ruta si es necesario)
const SurtidoEmail = require('../templates/SurtidoEmail');

// Función auxiliar para renderizar el componente React
const renderSurtidoEmail = (envioData) => {
    return renderToStaticMarkup(React.createElement(SurtidoEmail, { envio: envioData }));
};

// Mapeo de correos por almacén
const ALMACEN_EMAILS = {
    '1': 'rortiz@sealmarket.mx',
    '5': 'mazatlan@sealmarket.mx',
    '6': 'zacatecas@sealmarket.mx',
    '7': 'arodriguez@sealmarket.mx',
};

// =======================================================
// RUTA 1: POST /api/envios/
// Crear un nuevo registro de envío y sus productos asociados
// =======================================================
router.post('/', async (req, res) => {
    // ⚠️ Se espera un ARREGLO de envíos, aunque el ejemplo muestra un solo objeto.
    // Si siempre es un objeto, desestructuraríamos directamente const data = req.body.
    // Asumiremos que el cuerpo es UN OBJETO (el primer elemento del arreglo que mencionaste).
    const data = req.body;

    // Si el cuerpo llega como [ {...} ], ajusta a const data = req.body[0];

    // Extraer campos de alto nivel y el domicilio de envío
    const {
        folio: folioEnvio,
        folio_pedido,
        almacen_asignado,
        estado_envio,
        tipo_logistica,
        destino: shippingAddress,
        items_envio
    } = data;

    console.log(items_envio);

    // Iniciar una transacción de Sequelize
    const t = await db.sequelize.transaction();

    try {
        // 1. Mapeo de campos del domicilio a la cabecera del Envio
        const datosEnvioCabecera = {
            folio: folioEnvio,
            folio_pedido: folio_pedido,
            almacen_asignado: almacen_asignado,
            estado_envio: estado_envio,
            tipo_logistica: tipo_logistica,
            // 🚨 Mapeo directo de campos de DomicilioCliente a Envio:
            nombre_destinatario: shippingAddress.nombre_completo, // 'nombre_completo' en DomicilioCliente -> 'nombre_destinatario' en Envio
            calle: shippingAddress.calle,
            numero_ext: shippingAddress.numero_ext,
            numero_int: shippingAddress.numero_int,
            colonia: shippingAddress.colonia,
            ciudad: shippingAddress.ciudad,
            estado: shippingAddress.estado,
            codigo_postal: shippingAddress.codigo_postal,
            pais: shippingAddress.pais,
            tipo_domicilio: shippingAddress.tipo_domicilio,
            orden_domicilio: shippingAddress.orden_domicilio,
            numero_telefono: shippingAddress.numero_telefono,
            entre_calles: shippingAddress.entre_calles,
            referencia: shippingAddress.referencia,
            instrucciones_entrega: shippingAddress.instrucciones_entrega,
            ubicacion_latitud: shippingAddress.ubicacion_latitud,
            ubicacion_longitud: shippingAddress.ubicacion_longitud,
        };

        // 2. Creación del registro principal en la tabla Envio
        const nuevoEnvio = await Envio.create(datosEnvioCabecera, { transaction: t });

        // 3. Preparación de los datos para la tabla EnvioProducto
        // (Asumimos que el item tiene 'clave' y 'cantidad', y las demás columnas
        // del modelo EnvioProducto se llenarán más tarde o no son obligatorias)
        const productosEnvio = items_envio.map(item => ({
            folio_envio: folioEnvio,   // De la cabecera
            folio_pedido: folio_pedido, // De la cabecera
            clave: item.clave,
            cantidad: item.cantidad,
            unidad: item.unidad,
            descripcion: item.descripcion,
            estatus: "Pendiente de envío",
        }));

        // 4. Inserción masiva en la tabla EnvioProducto
        // Usa bulkCreate para una inserción eficiente
        await EnvioProducto.bulkCreate(productosEnvio, { transaction: t });

        // 5. Si todo fue bien, confirma la transacción
        await t.commit();

        // 6. Respuesta de éxito
        res.status(201).json({
            message: 'Envío y productos asociados creados exitosamente.',
            envio: nuevoEnvio,
            total_items: productosEnvio.length
        });

    } catch (error) {
        // Si algo falló, revierte todas las operaciones de la transacción
        await t.rollback();
        console.error('Error al crear el registro de envío (TRANSACCIÓN REVERTIDA):', error);

        // Ajustamos la respuesta a 500 para errores de base de datos no esperados
        res.status(500).json({
            error: 'Fallo al crear el registro de envío o sus productos.',
            detalle: error.message
        });
    }
});

// =======================================================
// RUTA 2: GET /api/envios/pedido/:folioPedido (sin usar)
// Obtener TODOS los registros de envío asociados a un folio de pedido
// =======================================================
router.get('/pedido/:folioPedido', async (req, res) => {
    try {
        const { folioPedido } = req.params;
        const envios = await Envio.findAll({
            where: { folio_pedido: folioPedido }
        });

        if (envios.length === 0) {
            return res.status(404).json({ error: 'No se encontraron envíos para ese folio de pedido.' });
        }
        res.status(200).json(envios);
    } catch (error) {
        console.error('Error al obtener los envíos por folio de pedido:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// =======================================================
// RUTA 3: PUT /api/envios/:folio/:folioPedido (sin usar)
// Actualizar un envío específico (por ejemplo, cambiar el estado_envio)
// =======================================================
router.put('/:folio/:folioPedido', async (req, res) => {
    try {
        const { folio, folioPedido } = req.params;

        // Sequelize buscará el registro por sus claves compuestas
        const [filasActualizadas, envioActualizado] = await Envio.update(req.body, {
            where: { folio: folio, folio_pedido: folioPedido },
            returning: true,
        });

        if (filasActualizadas === 0) {
            return res.status(404).json({ error: 'Envío no encontrado con el folio y folio de pedido proporcionados.' });
        }
        // Devuelve el registro actualizado
        res.status(200).json(envioActualizado[0]);
    } catch (error) {
        console.error('Error al actualizar el registro de envío:', error);
        res.status(400).json({ error: error.message });
    }
});


// =======================================================
// RUTA 5: POST /api/envios/surtir
// Recibe un arreglo de envíos (uno por almacén) y notifica
// =======================================================
router.post('/surtir', async (req, res) => {
    // 🚨 CORRECCIÓN CLAVE: Aseguramos que data sea un arreglo.
    // Si req.body es un arreglo, lo usa. Si es un objeto, lo envuelve en un arreglo.
    const enviosArray = Array.isArray(req.body) ? req.body : [req.body];
    //console.log("Pedido: ",enviosArray);

    if (enviosArray.length === 0) {
        return res.status(400).json({ error: 'El cuerpo debe ser un arreglo no vacío de envíos.' });
    }

    const resultados = [];

    // Iterar sobre cada objeto de envío
    for (const envio of enviosArray) {
        const almacen = String(envio.almacen_asignado);
        const tipo_logistica = envio.tipo_logistica;
        const destinatario = ALMACEN_EMAILS[almacen];
        const items_envioo = envio.items_envio;
        
        console.log(items_envioo);

        if (!destinatario) {
            resultados.push({
                folio: envio.folio,
                almacen: almacen,
                status: 'Error',
                message: `Correo no definido para el almacén ${almacen}`
            });
            continue;
        }

        try {
            // --- 2. ENRIQUECIMIENTO DE DATOS ---
            const claves = envio.items_envio.map(item => item.clave);

            // Llamada a la API de Inventario
            const responseInterna = await axios.post(`${process.env.INVENTARIO_API_URL}/envios/datos-internos`, {
                claves: claves,
                lista_precios: "1", // Valor por defecto según tu ejemplo
                SUCURSAL: "1"
            },
                {
                    headers: {
                        'x-api-key': process.env.FIREBIRD_API_KEY, // Se agrega la llave de seguridad
                        'Content-Type': 'application/json'
                    }
                });

            if (responseInterna.data && responseInterna.data.success) {
                const datosExtra = responseInterna.data.data;

                // Mapear los datos extra para un acceso rápido por clave (CVE_ART)
                const mapaExtra = {};
                datosExtra.forEach(prod => {
                    mapaExtra[prod.CVE_ART] = {
                        ULT_COSTO: prod.ULT_COSTO,
                        ULTIMO_PROVEEDOR: prod.ULTIMO_PROVEEDOR,
                        FCH_ULTCOM: prod.FCH_ULTCOM,
                        existencias: prod.existencias
                    };
                });

                // Inyectar los datos en items_envio
                envio.items_envio = envio.items_envio.map(item => {
                    const extra = mapaExtra[item.clave] || {};
                    return {
                        ...item,
                        ...extra // Esto agrega ULT_COSTO, ULTIMO_PROVEEDOR, etc.
                    };
                });
            }
            // -----------------------------------
            //console.log(envio);

            const htmlContent = renderSurtidoEmail(envio);


            await transporter.sendMail({
                from: '"Notificador de Surtido" <auto-confirm@sealmarket.mx>',
                to: destinatario,
                cc: ['orodriguez@sealmarket.mx','arodriguez@sealmarket.mx'],
                subject: `[URGENTE] Nuevo Pedido - Surtido para Almacén ${almacen} (Folio: ${envio.folio})`,
                html: htmlContent,
            });

            resultados.push({
                folio: envio.folio,
                almacen: almacen,
                status: 'Éxito',
                message: `Notificación enviada a ${destinatario}`
            });

        } catch (error) {
            console.error(`Error al enviar correo para el envío ${envio.folio}:`, error);
            // Revertimos la respuesta a 500 si hay un fallo de Nodemailer
            resultados.push({
                folio: envio.folio,
                almacen: almacen,
                status: 'Error',
                message: `Fallo de Nodemailer: ${error.message}`
            });
        }
    }

    // Devuelve el estado de todas las notificaciones
    res.status(200).json({
        message: 'Proceso de notificación a almacenes completado.',
        resultados: resultados
    });
});

module.exports = router;