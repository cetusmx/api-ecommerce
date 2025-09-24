'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductoPromocion extends Model {
    static associate(models) {
    }
  }
  ProductoPromocion.init({
    id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
    clave:  {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    descuento:  {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    precio:  {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    fecha_inicio:  {
      type: DataTypes.DATE,
      allowNull: false, 
    },
    fecha_final:  {
      type: DataTypes.DATE,
      allowNull: false, 
    },
  }, {
    sequelize,
    modelName: 'ProductoPromocion',
    tableName: 'ProductosPromocion'
  });
  return ProductoPromocion;
};