import dotenv from "dotenv";

dotenv.config();

export const databaseConfig = {
    dialect: process.env.DB_DIALECT as any,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: false
};