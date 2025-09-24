'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pedido extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Un pedido tiene muchos detalles de pedido
      /* Pedido.hasMany(models.PedidoDetalle, {
        foreignKey: 'pedidoId',
        as: 'detalles',
        onDelete: 'CASCADE' 
      }); */
    }
  }
  Pedido.init({
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
    enviar_a: {
      type: DataTypes.TEXT,
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
    cantidad:  {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    cant_por_empaque:  {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    estatus:  {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    total_partida:  {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false, 
    },
  }, {
    sequelize,
    modelName: 'Pedido',
  });
  return Pedido;
};