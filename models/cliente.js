'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cliente extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Un pedido tiene muchos detalles de pedido
      Cliente.hasMany(models.Pedido, {
        foreignKey: 'clienteId',
        as: 'pedidos',
        onDelete: 'CASCADE' // Esta línea es clave para el borrado en cascada
      });
      // Un pedido tiene muchos detalles de pedido
     /*  Cliente.hasMany(models.DomicilioCliente, {
        foreignKey: 'clienteId',
        as: 'domicilios',
        onDelete: 'CASCADE' // Esta línea es clave para el borrado en cascada
      }); */
    }
  }
  Cliente.init({
    nombre:  {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    apellido:  {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    email:  {
      type: DataTypes.STRING,
      allowNull: false, 
    },
  }, {
    sequelize,
    modelName: 'Cliente',
  });
  return Cliente;
};