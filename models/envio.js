'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Envio extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Envio.init({
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
    folio_pedido: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false, 
    },
    almacen_asignado: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estado_envio: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo_logistica: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nombre_destinatario:  {
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
    modelName: 'Envio',
  });
  return Envio;
};