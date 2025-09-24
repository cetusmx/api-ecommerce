'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Visita extends Model {
    static associate(models) {
      // Define las asociaciones aquí si las hubiera
    }
  }
  Visita.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    referrerUrl: {
      type: DataTypes.STRING(2048),
      allowNull: false,
    },
    referrerDomain: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isSearchEngine: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    searchEngineName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    currentUrl: {
      type: DataTypes.STRING(2048),
      allowNull: false,
    },
    utm_source: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    utm_medium: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    utm_campaign: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    utm_term: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    utm_content: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    visitorIp: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'Visita',
    tableName: 'visitas'
  });
  return Visita;
};