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
      /* Cliente.hasMany(models.Pedido, {
        foreignKey: 'clienteEmail',
        as: 'pedidos',
        onDelete: 'CASCADE', // Esta línea es clave para el borrado en cascada
        sourceKey: 'email',
      }); */
      // Un cliente tiene muchos domicilios
      Cliente.hasMany(models.DomicilioCliente, {
        foreignKey: 'clienteEmail',
        as: 'domicilios',
        sourceKey: 'email',
      });
    }
  }
  Cliente.init({
    id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
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
      primaryKey: true,
    },
  }, {
    sequelize,
    modelName: 'Cliente',
  });
  return Cliente;
};