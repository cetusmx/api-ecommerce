// /routes/pagos.js

const express = require('express');
const router = express.Router();
// Carga las variables de entorno si no lo haces en app.js
// require('dotenv').config(); 

// 🚨 CLAVE: Inicializa Stripe con la Clave Secreta del .env
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 

// ==========================================================
// Endpoint POST para crear un PaymentIntent
// ==========================================================
router.post('/crearintento', async (req, res) => {
    // ⚠️ NOTA DE SEGURIDAD: El monto siempre debe ser calculado 
    // en el backend para evitar manipulaciones en el frontend.
    
    // Suponemos que el body recibe el monto total y el folio del pedido
    const { totalPedido, folio, currency = 'mxn' } = req.body; 

    if (!totalPedido || !folio) {
        return res.status(400).json({ error: 'Faltan el monto total o el folio del pedido.' });
    }

    // 🚨 CLAVE DEL MONTO: Stripe espera el monto en la unidad más pequeña 
    // de la moneda (ej. centavos para MXN, USD). Multiplicamos por 100.
    const amountInCents = Math.round(totalPedido * 100);

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents, 
            currency: currency, 
            // Esto le indica a Stripe que debe manejar automáticamente los métodos de pago (tarjetas, etc.)
            automatic_payment_methods: { 
                enabled: true 
            },
            // Almacena información del pedido para referencia futura en el Dashboard de Stripe
            metadata: { 
                order_folio: folio,
                client_email: req.body.emailCliente // Ejemplo de campo adicional
            }, 
        });

        // 🏆 Éxito: Devolvemos el clientSecret al frontend
        // El clientSecret es NECESARIO para que Stripe.js en el frontend 
        // pueda confirmar el pago de forma segura.
        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
        });

    } catch (error) {
        console.error('Error al crear PaymentIntent:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor al procesar el intento de pago.',
            details: error.message 
        });
    }
});

module.exports = router;