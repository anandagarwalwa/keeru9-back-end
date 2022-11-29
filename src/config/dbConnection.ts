import dotenv from "dotenv";
dotenv.config()

import { Sequelize } from 'sequelize'

const sequelize = new Sequelize(process.env.DB_NAME ?? "sys", process.env.DB_USER ?? "root", process.env.DB_PASSWORD ?? "root", {
    host: process.env.DB_HOST ?? "127.0.0.1",
    dialect: 'mysql',
    port: parseInt(process.env.DB_PORT ?? "3306")
});

export default sequelize;