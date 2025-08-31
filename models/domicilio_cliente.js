'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DomicilioCliente extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DomicilioCliente.init({
    calle:  {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    numero_ext:  {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    numero_int:  {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    colonia:  {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    ciudad:  {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    estado:  {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    codigo_postal:  {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    pais:  {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    entre_calles:  {
      type: DataTypes.TEXT,
      allowNull: false, 
    },
    referencia:  {
      type: DataTypes.TEXT,
      allowNull: false, 
    },
    ubicacion_latitud:  {
      type: DataTypes.DECIMAL(10,8),
      allowNull: true, 
    },
    ubicacion_longitud:  {
      type: DataTypes.DECIMAL(10,8),
      allowNull: true, 
    },
  }, {
    sequelize,
    tableName: 'DomiciliosCliente',
    modelName: 'DomicilioCliente',
  });
  return DomicilioCliente;
};