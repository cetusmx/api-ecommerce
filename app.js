const express = require('express');
const app = express();
const PORT = process.env.PORT || 3004;

app.use(express.json());

const db = require('./models');

// Sincroniza todos los modelos con la base de datos
db.sequelize.sync({ force: true })
  .then(() => {
    console.log('¡Base de datos y tablas sincronizadas!');
    // Tu aplicación puede iniciar aquí
    // Por ejemplo, aquí podrías iniciar tu servidor Express
  })
  .catch(err => {
    console.error('Error al sincronizar la base de datos:', err);
  });

  // Importa y usa las rutas de productos
/* const productosRoutes = require('./routes/productos');
app.use('/api/productos', productosRoutes); */

// Importa y usa las rutas de clientes
const clientesRoutes = require('./routes/clientes');
app.use('/api/clientes', clientesRoutes);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});