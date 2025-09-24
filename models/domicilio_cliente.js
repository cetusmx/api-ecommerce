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
    nombre_completo:  {
      type: DataTypes.STRING,
      allowNull: false, 
    },
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
      allowNull: true, 
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
    tipo_domicilio:  {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    orden_domicilio:  {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    numero_telefono:  {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    entre_calles:  {
      type: DataTypes.TEXT,
      allowNull: true, 
    },
    referencia:  {
      type: DataTypes.TEXT,
      allowNull: true, 
    },
    instrucciones_entrega:  {
      type: DataTypes.TEXT,
      allowNull: true, 
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