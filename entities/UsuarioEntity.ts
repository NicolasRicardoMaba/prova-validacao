import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/sequelize";

export class UsuarioEntity extends Model { }

UsuarioEntity.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        login: { type: DataTypes.STRING, allowNull: false, unique: true },
        senha: { type: DataTypes.STRING, allowNull: false }
    },
        {
            sequelize,
            tableName: "usuarios",
            timestamps: false
        }
    );
