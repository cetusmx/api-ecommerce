'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Categoria extends Model {
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
        onDelete: 'CASCADE' 
      }); */
    }
  }
  Categoria.init({
    nombre:  {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false, 
    },
    descripcion:  {
      type: DataTypes.TEXT,
      allowNull: false, 
    },
    cuenta_contable:  {
      type: DataTypes.STRING,
      allowNull: true, 
    },
  }, {
    sequelize,
    modelName: 'Categoria',
    tableName: 'Categorias'
  });
  return Categoria;
};