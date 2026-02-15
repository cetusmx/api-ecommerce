const express = require('express');
const router = express.Router();
const db = require('../models');
const Pedido = db.Pedido;

const nodemailer = require('nodemailer');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

const PedidoEmail = require('../templates/PedidoEmail.jsx');

const Cliente = db.Cliente;



// Configuración del transporter (DEBES USAR TUS CREDENCIALES REALES AQUÍ)
const transporter = nodemailer.createTransport({
    host: "mail.sealmarket.mx",
    port: 465,
    secure: true, // Usar 'true' si el puerto es 465
    auth: {
        user: "auto-confirm@sealmarket.mx", // Tu correo de envío
        pass: "Trof#4102O" // Tu contraseña o App Password
    }
});

// 🚨 FUNCIÓN DE SERVICIO: Obtiene el nombre completo del titular
async function obtenerNombreTitular(email) {
    try {
        const cliente = await Cliente.findOne({
            where: { email: email },
            attributes: ['nombre', 'apellido']
        });
        
        if (cliente) {
            // Combinamos nombre y apellido para el nombre completo
            const nombreCompleto = `${cliente.nombre} ${cliente.apellido}`.trim();
            
            // 🚨 CLAVE: Dividimos el nombre por el espacio y tomamos la primera palabra
            const primerNombre = cliente.nombre.split(' ')[0]; 

            return {
                completo: nombreCompleto,
                saludo: primerNombre
            };
        }
        return {
            completo: 'Titular no encontrado',
            saludo: 'Cliente'
        };
    } catch (error) {
        console.error('Error al buscar el nombre del titular:', error);
        return {
            completo: 'Error de búsqueda',
            saludo: 'Cliente'
        };
    }
}

// Endpoint para enviar la confirmación de pedido
router.post('/:folio/enviar-confirmacion', async (req, res) => {
    const { folio } = req.params;
    const itemsArray = req.body; 

    try {
        // 1. Validación del Body
        if (!Array.isArray(itemsArray) || itemsArray.length === 0) {
            return res.status(400).json({ error: 'El cuerpo de la solicitud debe ser un arreglo no vacío de partidas de pedido.' });
        }

        const primeraPartida = itemsArray[0];
        
        if (!primeraPartida.email || !primeraPartida.enviar_a || !primeraPartida.total_pedido) {
            return res.status(400).json({ error: 'Faltan campos de cabecera críticos (email, enviar_a, o total_pedido) en el cuerpo de la solicitud.' });
        }

        // 🚨 CLAVE: Llamada a la función para obtener el nombre del titular
        //const nombreTitular = await obtenerNombreTitular(primeraPartida.email);

        // 2. Reestructurar las partidas en el objeto 'pedido' para la plantilla
        const pedidoData = {
            folio: primeraPartida.folio,
            emailCliente: primeraPartida.email, 
            enviar_a: primeraPartida.enviar_a,
            estatus: primeraPartida.estatus || 'Pendiente de envío',
            
            // 🚨 NUEVO CAMPO AGREGADO
            //nombreTitular: nombreTitular, 
            
            // Campos adicionales de cabecera
            createdAt: primeraPartida.createdAt || new Date().toISOString(),
            metodo_pago: primeraPartida.metodo_pago || 'N/A',
            costo_envio: primeraPartida.costo_envio || 0,
            
            total: parseFloat(primeraPartida.total_pedido).toFixed(2),
            
            items: itemsArray.map(item => ({
                clave: item.clave,
                descripcion: item.descripcion,
                cantidad: item.cantidad,
                total_partida: item.total_partida,
                linea: item.linea || 'SIN_LINEA',
                perfil: item.perfil || 'SIN PERFIL',
                fecha_entrega: item.fecha_entrega || 'N/A' 
            }))
        };
        
        // ... (Renderizado, Nodemailer y respuesta) ...
        
        const html = renderToStaticMarkup(React.createElement(PedidoEmail, { pedido: pedidoData }));

        const mailOptions = {
            from: '"Seal Market" <auto-confirm@sealmarket.mx>',
            to: pedidoData.emailCliente,
            subject: `Confirmación de Pedido #${pedidoData.folio}`,
            html: html,
        };

        const info = await transporter.sendMail(mailOptions);
        
        console.log('Mensaje enviado: %s', info.messageId);

        res.status(200).json({ 
            message: 'Correo de confirmación enviado con éxito.', 
            messageId: info.messageId 
        });

    } catch (error) {
        console.error('Error al enviar el correo de confirmación:', error);
        res.status(500).json({ error: 'Error interno del servidor al enviar el correo.' });
    }
});


// Endpoint para crear una nueva pedido
router.post('/', async (req, res) => {
    //console.log("Crenado nvo pedido ",req.body);
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

        if (!pedido || pedido.length === 0) {
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

        if (!pedido || pedido.length === 0) {
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