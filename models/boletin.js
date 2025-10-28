'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Boletin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Un pedido tiene muchos detalles de pedido
      /* Cliente.hasMany(models.Pedido, {
        foreignKey: 'clienteEmail',
        as: 'pedidos',
        onDelete: 'CASCADE', // Esta línea es clave para el borrado en cascada
        sourceKey: 'email',
      }); */
      // Un cliente tiene muchos domicilios
      /* Boletin.hasMany(models.DomicilioCliente, {
        foreignKey: 'clienteEmail',
        as: 'domicilios',
        sourceKey: 'email',
      }); */
    }
  }
Boletin.init({
    id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
    email:  {
      type: DataTypes.STRING,
      allowNull: false, 
      primaryKey: true,
      unique: true
    },
     estatus: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
  }, {
    sequelize,
    modelName: 'Boletin',
    tableName: 'Boletines'
  });
  return Boletin;
};