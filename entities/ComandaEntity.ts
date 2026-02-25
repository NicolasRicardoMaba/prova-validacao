import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/sequelize";

export class ComandaEntity extends Model {}

ComandaEntity.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    idCliente: { type: DataTypes.INTEGER, allowNull: false }
  },
  {
    sequelize,
    tableName: "comandas",
    timestamps: false
  }
);