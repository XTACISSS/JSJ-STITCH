import { Client } from 'pg';
import { Sequelize, DataTypes } from 'sequelize';

// const db = new Client({
//     host:process.env.DB_HOST,
//     password:process.env.DB_PASSWORD,
//     port:Number(process.env.DB_PORT) || 5432
// })

export const sequelize = new Sequelize({
    host:process.env.DB_HOST || 'localhost',
    username:process.env.DB_USER || 'postgres',
    database:process.env.DB_NAME || 'postgres',
    password:process.env.DB_PASSWORD!,
    port:Number(process.env.DB_PORT) || 5432,
    ssl:true,
    dialect:'postgres',
    dialectOptions:{
        ssl:{
            required:true,
            rejectUnauthorized: false
        }
    },
    logging:false
}) 

export {DataTypes};
// export default db;