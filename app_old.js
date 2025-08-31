// Carga las variables de entorno desde el archivo .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Importa la conexión a la base de datos desde el archivo models/index.js
const { sequelize } = require('./models');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

// Define una ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Hola, mundo desde tu API de e-commerce!');
});

// Sincroniza la base de datos
sequelize.sync()
  .then(() => {
    console.log('Database synced successfully!');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});