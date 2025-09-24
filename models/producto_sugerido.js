'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductoSugerido extends Model {
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
  ProductoSugerido.init({
    id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
    clave:  {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: true, 
    },
    descripcion:  {
      type: DataTypes.TEXT,
      allowNull: false, 
    },
    descuento:  {
      type: DataTypes.INTEGER,
      allowNull: true, 
    },
    estatus:  {
      type: DataTypes.STRING,
      allowNull: true, 
    },
  }, {
    sequelize,
    modelName: 'ProductoSugerido',
    tableName: 'ProductosSugeridos'
  });
  return ProductoSugerido;
};