// /routes/envios.js (Añadir este bloque al final del archivo)

// Importar utilidades necesarias
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

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
    '1': 'contacto@sealmarket.mx',
    '6': 'orodriguez@sealmarket.mx',
};

// =======================================================
// RUTA 5: POST /api/envios/surtir
// Recibe un arreglo de envíos (uno por almacén) y notifica
// =======================================================
router.post('/surtir', async (req, res) => {
    // 🚨 CORRECCIÓN CLAVE: Aseguramos que data sea un arreglo.
    // Si req.body es un arreglo, lo usa. Si es un objeto, lo envuelve en un arreglo.
    const enviosArray = Array.isArray(req.body) ? req.body : [req.body];

    if (enviosArray.length === 0) {
        return res.status(400).json({ error: 'El cuerpo debe ser un arreglo no vacío de envíos.' });
    }

    const resultados = [];

    // Iterar sobre cada objeto de envío
    for (const envio of enviosArray) {
        const almacen = String(envio.almacen_asignado);
        const destinatario = ALMACEN_EMAILS[almacen];
        
        if (!destinatario) {
            resultados.push({ 
                folio: envio.folio, 
                almacen: almacen, 
                status: 'Error', 
                message: `Correo no definido para el almacén ${almacen}` 
            });
            continue;
        }
        
        const htmlContent = renderSurtidoEmail(envio);

        try {
            await transporter.sendMail({
                from: '"Notificador de Surtido" <auto-confirm@sealmarket.mx>',
                to: destinatario,
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