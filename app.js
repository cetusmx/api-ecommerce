const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3004;

// Configure CORS to allow all origins. Quitar para produccion
//app.use(cors()); 
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173']
}));

// Aumenta el límite de tamaño del payload a 50mb (o el tamaño que necesites)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan());

//app.use(express.json());

const db = require('./models');

// Sincroniza todos los modelos con la base de datos
/* db.sequelize.sync({ force: false }) */
db.sequelize.sync({ force: false })
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

// Importa y usa las rutas de productos
const productosRoutes = require('./routes/productos');
app.use('/api/productos', productosRoutes);

// Importa y usa las rutas de categorías
const categoriasRoutes = require('./routes/categorias');
app.use('/api/categorias', categoriasRoutes);

// Importa y usa las rutas de domicilios
const domiciliosRoutes = require('./routes/domicilios');
app.use('/api/domicilios', domiciliosRoutes);

// Importa y usa las rutas de productos sugeridos
const prodSugeridosRoutes = require('./routes/productos_sugeridos');
app.use('/api/sugeridos', prodSugeridosRoutes);

//Consulta de schemas de tablas
const schemaRoutes = require('./routes/schema');
app.use('/api/schema', schemaRoutes);

// Importa y usa las rutas de lineas vendibles
const lineasVendiblesRoutes = require('./routes/lineas_vendibles');
app.use('/api/lineasvendibles', lineasVendiblesRoutes);

// Importa y usa las rutas de relaciones productos
const relacionesProductosRoutes = require('./routes/relaciones_productos');
app.use('/api/relacionesproducto', relacionesProductosRoutes);

// Importa y usa las rutas de productos vistos
const productosVistos = require('./routes/productos_vistos');
app.use('/api/productosvistos', productosVistos);

// Importa y usa las rutas de productos en promoción
const productosPromocion = require('./routes/productos_promocion');
app.use('/api/productospromocion', productosPromocion);

// Importa y usa las rutas de carrito
const carritos = require('./routes/carritos');
app.use('/api/carritos', carritos);

// Importa y usa las rutas de pedido
const pedidos = require('./routes/pedidos');
app.use('/api/pedidos', pedidos);

// Importa y usa las rutas de visitas
const visitasRouter  = require('./routes/visitas');
app.use('/api/analytics/visit', visitasRouter);

// Importa y usa las rutas de pagos
const pagosRoutes = require('./routes/pagos'); // Ajusta la ruta si es necesario
app.use('/api/pagos', pagosRoutes); // Acceso: POST /api/pagos/crear-intento

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});