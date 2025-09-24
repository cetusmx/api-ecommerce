'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Carrito extends Model {
    static associate(models) {
    }
  }
  Carrito.init({
    id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
    email:  {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    clave:  {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    cantidad:  {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    precio: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true, 
    },
    fecha:  {
      type: DataTypes.DATE,
      allowNull: false, 
    },
  }, {
    sequelize,
    modelName: 'Carrito',
    tableName: 'Carritos'
  });
  return Carrito;
};