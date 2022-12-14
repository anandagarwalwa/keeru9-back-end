import dotenv from "dotenv";
dotenv.config()

import { Sequelize } from 'sequelize'

const sequelize = new Sequelize(process.env.DB_NAME ?? "keeru9", process.env.DB_USER ?? "root", process.env.DB_PASSWORD ?? "", {
    host: process.env.DB_HOST ?? "3.19.97.191",
    dialect: 'mysql',
    port: parseInt(process.env.DB_PORT ?? "3306")
});

export default sequelize;
