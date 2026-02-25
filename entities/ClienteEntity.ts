import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/sequelize";

export class ClienteEntity extends Model {}

ClienteEntity.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nome: { type: DataTypes.STRING, allowNull: false },
    telefone: { type: DataTypes.STRING, allowNull: false }
  },
  {
    sequelize,
    tableName: "clientes",
    timestamps: false
  }
);
