const express = require('express');
const router = express.Router();
const multer = require('multer');
const nodemailer = require('nodemailer');

// --- 1. CONFIGURACIÓN DE MULTER ---
// Multer para almacenar el archivo temporalmente en memoria (buffer).
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- 2. CONFIGURACIÓN DE NODEMAILER ---
const transporter = nodemailer.createTransport({
    host: "mail.sealmarket.mx",
    port: 465,
    secure: true, // Usar 'true' si el puerto es 465
    auth: {
        user: "auto-confirm@sealmarket.mx", // Tu correo de envío
        pass: "Trof#4102O" // Tu contraseña o App Password
    }
});

// Correo fijo del personal de facturación
const CORREO_PERSONAL_FACTURACION = 'orodriguez@sealmarket.mx';

// --- ENDPOINT: POST /enviaconstancia ---
// 'upload.single('pdfFile')' procesa el archivo del frontend
router.post('/enviaconstancia', upload.single('pdfFile'), async (req, res) => {
    try {
        // A. Obtener datos (Multer procesa el body y el file)
        const { folio } = req.body;
        const { monto } = req.body;
        
        const file = req.file; // Archivo está en req.file

        if (!folio || !file) {
            return res.status(400).json({ error: 'Faltan el número de folio o el archivo PDF.' });
        }

        // B. Preparar el attachment
        const attachment = {
            filename: `Solicitud_Factura_${folio}.pdf`, // Nombre que verá el receptor
            content: file.buffer,                       // El buffer de memoria del archivo
            contentType: file.mimetype
        };

        // C. Opciones del correo
        const mailOptions = {
            from: '"Sistema Automático" <auto-confirm@sealmarket.mx>',
            to: CORREO_PERSONAL_FACTURACION,
            subject: `📧 Solicitud de Facturación - Folio: ${folio}`,
            html: `
                <p>Estimado personal de Facturación,</p>
                <p>Se ha recibido una nueva solicitud para facturar el pedido con el **Folio ${folio}**. El monto de este pedido es de $${monto}</p>
                <p>El documento adjunto debe ser procesado. Favor de generar la factura y enviarla al cliente.</p>
            `,
            attachments: [attachment],
        };

        // D. Envío
        const info = await transporter.sendMail(mailOptions);
        console.log('Correo de solicitud enviado a facturación. ID: %s', info.messageId);

        // E. Respuesta exitosa al frontend
        res.status(200).json({ 
            mensaje: 'Solicitud enviada al personal de facturación con éxito.', 
            folio: folio
        });

    } catch (error) {
        console.error('Error al procesar la solicitud o enviar el correo:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor al procesar la solicitud.',
            detalle: error.message 
        });
    }
});

module.exports = router;