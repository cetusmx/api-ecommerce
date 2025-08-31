'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PedidoDetalle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PedidoDetalle.init({
    cantidad: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    clave:  {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    origen: {
      type: DataTypes.STRING,
      allowNull: true, 
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
    precio: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true, 
    },
    total:  {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true, 
    },
  }, {
    sequelize,
    /* tableName: 'PedidoDetalle', */
    modelName: 'PedidoDetalle',
  });
  return PedidoDetalle;
};