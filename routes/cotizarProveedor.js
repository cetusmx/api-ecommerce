const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// --- A. CONFIGURACIÓN DE NODEMAILER ---
// **IMPORTANTE**: Sustituye los valores de auth por tus credenciales reales.
const transporter = nodemailer.createTransport({
    host: "mail.sealmarket.mx",
    port: 465,
    secure: true, // Usar 'true' si el puerto es 465
    auth: {
        user: "auto-confirm@sealmarket.mx", // Tu correo de envío
        pass: "Trof#4102O" // Tu contraseña o App Password
    }
});

// Correo de Destino Fijo
const CORREO_COTIZACION_DESTINO = 'orodriguez@sealmarket.mx';


// --- B. FUNCIONES AUXILIARES ---

/**
 * Procesa el array de productos y genera las filas de la tabla HTML.
 * Implementa la lógica de fallback para la Clave Proveedor: PROV1 -> CLA_LC -> "Utilizar descripción".
 */
const generateTableRows = (productos) => {
    let rows = '';
    productos.forEach(item => {
        const { product, quantity } = item;
        
        let claveProveedor = product.PROV1;
        
        if (!claveProveedor) {
            claveProveedor = product.CLA_LC;
        }
        
        if (!claveProveedor) {
            claveProveedor = "Utilizar descripción";
        }

        // Generación de la fila de la tabla HTML
        rows += `
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${quantity}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${product.CVE_ART}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${claveProveedor}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${product.DESCR}</td>
            </tr>
        `;
    });
    return rows;
};


// --- C. ENDPOINT: POST /solicitacotizacion ---

router.post('/solicitacotizacion', async (req, res) => {
    try {
        const productos = req.body; 

        if (!Array.isArray(productos) || productos.length === 0) {
            return res.status(400).json({ error: 'El cuerpo de la solicitud debe ser un array con al menos un producto.' });
        }

        const tableRows = generateTableRows(productos);
        
        const htmlBody = `
            Favor de cotizar el siguiente material y enviar en un archivo pdf.<br/>
            
            <p>Estimado Oscar Rodríguez,</p>
            <p>Se ha generado una nueva solicitud de cotización para los siguientes productos:</p>
            
            <table style="width:100%; border-collapse: collapse; margin: 20px 0; font-family: Arial, sans-serif;">
                <thead>
                    <tr style="background-color: #f2f2f2;">
                        <th style="border: 1px solid #ddd; padding: 10px; text-align: center;">Cantidad</th>
                        <th style="border: 1px solid #ddd; padding: 10px;">Clave</th>
                        <th style="border: 1px solid #ddd; padding: 10px;">Clave Proveedor</th>
                        <th style="border: 1px solid #ddd; padding: 10px;">Descripción</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
            
            <p>Agradecemos su pronta atención a esta solicitud.</p>
            <br/>
            <p>Saludos cordiales.</p>
        `;

        const mailOptions = {
            from: '"Sistema E-commerce" <tu_correo_de_envio@empresa.com>',
            to: CORREO_COTIZACION_DESTINO, 
            subject: `📝 Solicitud de Cotización de ${productos.length} Producto(s) - ${new Date().toLocaleDateString('es-MX')}`,
            html: htmlBody,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Correo de cotización enviado. ID: %s', info.messageId);

        res.status(200).json({ 
            mensaje: 'Solicitud de cotización enviada con éxito.',
            total_productos: productos.length,
            messageId: info.messageId
        });

    } catch (error) {
        console.error('Error al procesar la solicitud de cotización:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor al procesar la solicitud de cotización.',
            detalle: error.message 
        });
    }
});

module.exports = router;