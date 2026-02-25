import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/sequelize";

export class ProdutoEntity extends Model { }

ProdutoEntity.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: false, primaryKey: true },
        nome: { type: DataTypes.STRING, allowNull: false },
        preco: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        idComanda: { type: DataTypes.INTEGER, allowNull: false }
    },
    {
        sequelize,
        tableName: "produtos",
        timestamps: false
    }
);