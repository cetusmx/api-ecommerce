// routes/schema.js
const express = require('express');
const router = express.Router();
const db = require('../models');

// Endpoint para obtener el esquema de una tabla por su nombre
router.get('/:tableName', async (req, res) => {
    try {
        const { tableName } = req.params;
        const queryInterface = db.sequelize.getQueryInterface();
        
        // Verifica si la tabla existe antes de describirla para evitar errores
        const tables = await queryInterface.showAllTables();
        if (!tables.includes(tableName)) {
            return res.status(404).json({ error: `La tabla '${tableName}' no existe.` });
        }
        
        const tableDefinition = await queryInterface.describeTable(tableName);

        const columnsInfo = Object.keys(tableDefinition).map(columnName => {
            const column = tableDefinition[columnName];
            const isOptional = column.allowNull;
            
            return {
                name: columnName,
                isOptional: isOptional,
                type: column.type,
            };
        });

        res.status(200).json({ tableName, columns: columnsInfo });

    } catch (error) {
        console.error('Error al consultar el esquema de la tabla:', error);
        res.status(500).json({ error: 'Error interno del servidor al consultar el esquema.' });
    }
});

module.exports = router;