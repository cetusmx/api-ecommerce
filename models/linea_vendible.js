'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LineaVendible extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      /* Categoria.hasMany(models.Categoria, {
        foreignKey: 'categoriaPadreId',
        as: 'nivelsuperior',
        allowNull: true,
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
      }); */
    }
  }
  LineaVendible.init({
    id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
    linea:  {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    descripcion:  {
      type: DataTypes.TEXT,
      allowNull: false, 
    },
    estatus:  {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    prefijo:  {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    sufijo:  {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    observaciones:  {
      type: DataTypes.TEXT,
      allowNull: true, 
    },
    tipo:  {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    colocado_en:  {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    claveSAT:  {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    clave_unidad:  {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    categoria:  {
      type: DataTypes.STRING,
      allowNull: true, 
    },
  }, {
    sequelize,
    modelName: 'LineaVendible',
    tableName: 'LineasVendibles'
  });
  return LineaVendible;
};