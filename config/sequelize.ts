import { Sequelize } from "sequelize";
import { databaseConfig } from "./database";


export const sequelize = new Sequelize(
  databaseConfig.database!,
  databaseConfig.username!,
  databaseConfig.password!,
  databaseConfig
);

export async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Banco conectado com sucesso");

    const { ClienteEntity } = await import("../entities/ClienteEntity");
    const { ComandaEntity } = await import("../entities/ComandaEntity");
    const { ProdutoEntity } = await import("../entities/ProdutoEntity");

    ClienteEntity.hasMany(ComandaEntity, { foreignKey: 'idCliente', as: 'comandas' });
    ComandaEntity.belongsTo(ClienteEntity, { foreignKey: 'idCliente', as: 'cliente' });

    ComandaEntity.hasMany(ProdutoEntity, { foreignKey: 'idComanda', as: 'produtos' });
    ProdutoEntity.belongsTo(ComandaEntity, { foreignKey: 'idComanda', as: 'comanda' });

    await sequelize.sync({ alter: true });
    console.log("syncado.");
  } catch (error) {
    console.error("Erro sync:", error);
    process.exit(1);
  }
}