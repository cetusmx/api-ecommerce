const express = require('express');
const router = express.Router();
const db = require('../models');
const DomicilioCliente = db.DomicilioCliente;

// Endpoint para crear un nuevo domicilio
router.post('/', async (req, res) => {
    console.log(req.body);
    try {
        const nuevoDomicilio = await DomicilioCliente.create(req.body);
        res.status(201).json(nuevoDomicilio);
    } catch (error) {
        console.error('Error al crear el domicilio:', error);
        res.status(400).json({ error: error.message });
    }
});

// Endpoint para actualizar el campo orden_domicilio por ID
router.put('/orden/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { orden_domicilio } = req.body;

        console.log(`[Backend Debug] Recibida solicitud PUT para /orden/${id}`);
        console.log(`[Backend Debug] Body recibido:`, req.body);

        const [affectedCount, affectedRows] = await DomicilioCliente.update({
            orden_domicilio: orden_domicilio
        }, {
            where: {
                id: id
            },
            returning: true,
        });

        console.log(`[Backend Debug] Filas actualizadas: ${affectedCount}`);
        console.log(`[Backend Debug] Domicilio actualizado:`, affectedRows);

        if (affectedCount === 0) {
            console.log(`[Backend Debug] Domicilio con ID ${id} no encontrado.`);
            return res.status(404).json({
                error: 'Domicilio no encontrado'
            });
        }

        // CORRECCIÓN AQUÍ: Verificar si affectedRows contiene instancias antes de
        //intentar acceder a affectedRows[0]
        if (affectedRows && affectedRows.length > 0) {
            console.log("[Backend Debug] Enviando respuesta 200 OK con:", affectedRows[0]);
            res.status(200).json(affectedRows[0]);
        } else {
            // Si affectedCount > 0 pero affectedRows está vacío (puede pasar con
            //algunas configuraciones de DB/Sequelize),
            // aún así enviamos una respuesta de éxito para evitar el error en el frontend.
            console.log(`[Backend Debug] Actualización exitosa para ID ${id}, pero no se
  retornó la instancia actualizada. Enviando mensaje de éxito genérico.`);
            res.status(200).json({ message: 'Actualización exitosa', id: id });
        }

        /* console.log("[Backend Debug] Enviando respuesta 200 OK con:", affectedRows[0]);
        res.status(200).json(affectedRows[0]); */
    } catch (error) {
        console.error('Error al actualizar la orden del domicilio:', error);
        res.status(400).json({
            error: error.message
        });
    }
});

// Endpoint para obtener todos los domicilios
router.get('/', async (req, res) => {
    try {
        const domicilios = await DomicilioCliente.findAll();
        res.status(200).json(domicilios);
    } catch (error) {
        console.error('Error al obtener todos los domicilios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para obtener un domicilio por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const domicilio = await DomicilioCliente.findByPk(id);

        if (!domicilio) {
            return res.status(404).json({ error: 'Domicilio no encontrado' });
        }
        res.status(200).json(domicilio);
    } catch (error) {
        console.error('Error al obtener el domicilio por ID:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para obtener domicilios por cliente
router.get('/cliente/:clienteId', async (req, res) => {
    try {
        const { clienteId } = req.params;
        const domicilios = await DomicilioCliente.findAll({
            where: {
                clienteId: clienteId
            }
        });
        res.status(200).json(domicilios);
    } catch (error) {
        console.error('Error al obtener los domicilios por cliente:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para actualizar un domicilio por ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [filasActualizadas, domicilioActualizado] = await DomicilioCliente.update(req.body, {
            where: { id: id },
            returning: true,
        });

        if (filasActualizadas === 0) {
            return res.status(404).json({ error: 'Domicilio no encontrado' });
        }
        res.status(200).json(domicilioActualizado[0]);
    } catch (error) {
        console.error('Error al actualizar el domicilio:', error);
        res.status(400).json({ error: error.message });
    }
});

// Endpoint para eliminar un domicilio por ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const domicilioEliminado = await DomicilioCliente.destroy({
            where: { id: id }
        });

        if (domicilioEliminado === 0) {
            return res.status(404).json({ error: 'Domicilio no encontrado' });
        }
        res.status(200).json({ message: 'Domicilio eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar el domicilio:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Nuevo endpoint para obtener domicilios por clienteEmail
router.get('/email/:clienteEmail', async (req, res) => {
    console.log(req.params);
    try {
        const { clienteEmail } = req.params;

        // Primero, encontrar al cliente por su email
        /*  const cliente = await DomicilioCliente.findOne({
             where: { clienteEmail: clienteEmail }
         });
 
         if (!cliente) {
             return res.status(404).json({ error: 'Cliente no encontrado' });
         } */

        // Luego, encontrar los domicilios asociados a ese cliente
        const domicilios = await DomicilioCliente.findAll({
            where: {
                clienteEmail: clienteEmail,
            }
        });

        res.status(200).json(domicilios);
    } catch (error) {
        console.error('Error al obtener los domicilios por email del cliente-ojo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;