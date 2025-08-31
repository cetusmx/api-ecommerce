'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Producto extends Model {
    static associate(models) {
      // Define las asociaciones aquí
      // Por ejemplo, si un producto puede estar en muchos detalles de pedido
      // Producto.hasMany(models.PedidoDetalle, { foreignKey: 'productoId' });
    }
  }
  Producto.init({
    clave: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    linea: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    unidad_entrada: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    unidad_salida: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    tiempo_surtido: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    control_almacen: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    factor_entre_unidades: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    volumen: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true, 
    },
    peso: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true, 
    },
    unidad_empaque: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    precio: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true, 
    },
    moneda: {
      type: DataTypes.INTEGER,
      allowNull: false, 
    },
    costeo: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    impuestos: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false, 
    },
    ieps: {
      type: DataTypes.BOOLEAN,
      allowNull: true, 
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true, 
    },
    claveSAT: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    clave_unidad: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    existencia: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false, 
    },
    ultimo_costo: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true, 
    },
    ultima_compra: {
      type: DataTypes.DATE,
      allowNull: true, 
    },
    diam_int: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true, 
    },
    diam_ext: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true, 
    },
    altura: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true, 
    },
    seccion: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true, 
    },
    material: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    temperatura: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    presion: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    clave_fab: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    perfil: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    clave_ant: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    proveedor1: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    proveedor2: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    sistema_medicion: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
  }, {
    sequelize,
    modelName: 'Producto',
  });
  return Producto;
};