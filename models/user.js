const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => (
  sequelize.define('user', {
    'email': {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    'password': {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    'nick': {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
  },
    {
      sequelize,
      timestamps: false,
      modelName: "Users",
      tableName: "users",
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci"
    }
  )
)