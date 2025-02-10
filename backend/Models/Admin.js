const sequelize = require("../connection/db");
const { DataTypes } = require("sequelize");

const Admin = sequelize.define(
  "Admin",
  {
    adminId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    adminname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status:{
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    disable: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue:null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Admin;
