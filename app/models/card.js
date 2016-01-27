'use strict';

module.exports = function(sequelize, DataTypes) {
  var Card = sequelize.define('Card', {
    seals: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 0
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
    underscored: true,
    tableName: 'cards',
    classMethods: {
      associate: function(models) {
        Card.belongsTo(models.Company, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });
  return Card;
};
