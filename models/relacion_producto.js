'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RelacionProducto extends Model {
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
  RelacionProducto.init({
    categoria:  {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: true, 
    },
    relacionado1:  {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    relacionado2:  {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    relacionado3:  {
      type: DataTypes.STRING,
      allowNull: false, 
    },
  }, {
    sequelize,
    modelName: 'RelacionProducto',
    tableName: 'RelacionesProducto'
  });
  return RelacionProducto;
};