'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductoVisto extends Model {
    static associate(models) {
    }
  }
  ProductoVisto.init({
    id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
    clave:  {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    email:  {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    sessionId:  {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    fecha:  {
      type: DataTypes.DATE,
      allowNull: false, 
    },
  }, {
    sequelize,
    modelName: 'ProductoVisto',
    tableName: 'ProductosVistos'
  });
  return ProductoVisto;
};