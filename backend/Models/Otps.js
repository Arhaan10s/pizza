const sequelize = require("../connection/db");
const { DataTypes } = require("sequelize");

const Otp = sequelize.define(
  "Otp",
  {
    otp: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    status:{
      type: DataTypes.INTEGER,
      defaultValue: 0,  
    },
    otp_expires: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otp_attempts: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = Otp;
