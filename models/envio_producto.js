'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EnvioProducto extends Model {
    static associate(models) {
      // Define las asociaciones aquí
      // Por ejemplo, si un producto puede estar en muchos detalles de pedido
      // Producto.hasMany(models.PedidoDetalle, { foreignKey: 'productoId' });
    }
  }
  EnvioProducto.init({
    id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
    folio_envio: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false, 
    },
    folio_pedido: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false, 
    },
    clave: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    unidad: {
      type: DataTypes.STRING,
      allowNull: false, 
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
    cant_por_empaque: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    observaciones: {
      type: DataTypes.TEXT,
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
  }, {
    sequelize,
    modelName: 'EnvioProducto',
  });
  return EnvioProducto;
};