'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AcercaDe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AcercaDe.init({
    id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
    perfil:  {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    acerca_de_producto:  {
      type: DataTypes.TEXT,
      allowNull: false, 
    },
  }, {
    sequelize,
    modelName: 'AcercaDe',
    tableName: 'AcercaDe'
  });
  return AcercaDe;
};