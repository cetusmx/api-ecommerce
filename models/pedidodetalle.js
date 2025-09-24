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
    id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
    folio: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false, 
    },
    email:  {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    enviado_a: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    total:  {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true, 
    },
    facturado:  {
      type: DataTypes.STRING,
      allowNull: true, 
    },
  }, {
    sequelize,
    /* tableName: 'PedidoDetalle', */
    modelName: 'PedidoDetalle',
  });
  return PedidoDetalle;
};