const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

// Importa las nuevas plantillas
const ContactoEmailStaff = require('../templates/ContactoEmailStaff.jsx');
const ContactoEmailClient = require('../templates/ContactoEmailClient.jsx');

// Configuración del transporter (Reutilizada de pedidos.js)
const transporter = nodemailer.createTransport({
    host: "mail.sealmarket.mx",
    port: 465,
    secure: true, // Usar 'true' si el puerto es 465
    auth: {
        user: "auto-confirm@sealmarket.mx", // Tu correo de envío
        pass: "Trof#4102O" // Tu contraseña o App Password
    }
});

/**
 * @route POST /api/contacto/enviar
 * @desc Recibe los datos del formulario de contacto y envía dos correos.
 */
router.post('/enviar', async (req, res) => {
    // Desestructurar los campos requeridos y el opcional
    const { nombre, email, mensaje, telefono } = req.body; 

    try {
        // 1. Validación de campos requeridos
        if (!nombre || !email || !mensaje) {
            return res.status(400).json({ error: 'Faltan campos requeridos: nombre, email y mensaje.' });
        }

        // 2. 🚨 Correo para el Personal (Staff)
        const htmlStaff = renderToStaticMarkup(React.createElement(ContactoEmailStaff, { 
            nombre, 
            email, 
            telefono, 
            mensaje 
        }));

        const mailOptionsStaff = {
            from: '"Seal Market Contacto" <auto-confirm@sealmarket.mx>',
            to: "contacto@sealmarket.mx", // 👈 Cambia esto al correo de tu equipo
            subject: `[CONTACTO] Nuevo mensaje de ${nombre}`,
            html: htmlStaff,
        };

        const infoStaff = await transporter.sendMail(mailOptionsStaff);
        console.log('Mensaje de Staff enviado: %s', infoStaff.messageId);

        // 3. 📧 Correo para el Cliente (Confirmación de recepción)
        // Tomamos solo el primer nombre para el saludo si hay apellidos
        const nombreSaludo = nombre.split(' ')[0]; 

        const htmlClient = renderToStaticMarkup(React.createElement(ContactoEmailClient, { 
            nombre: nombreSaludo 
        }));

        const mailOptionsClient = {
            from: '"Seal Market" <auto-confirm@sealmarket.mx>',
            to: email, // El correo del usuario que envió el formulario
            subject: `Confirmación de Recepción de Mensaje - Seal Market`,
            html: htmlClient,
        };

        const infoClient = await transporter.sendMail(mailOptionsClient);
        console.log('Mensaje de Cliente enviado: %s', infoClient.messageId);


        // 4. Respuesta de éxito
        res.status(200).json({ 
            message: 'Mensaje de contacto recibido y correos enviados con éxito.', 
            staffMessageId: infoStaff.messageId,
            clientMessageId: infoClient.messageId,
        });

    } catch (error) {
        console.error('Error al procesar el formulario de contacto:', error);
        res.status(500).json({ error: 'Error interno del servidor al procesar el contacto.' });
    }
});

module.exports = router;