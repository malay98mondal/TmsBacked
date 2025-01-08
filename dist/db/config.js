"use strict";
// import { Dialect, Sequelize } from 'sequelize';
// import dotenv from 'dotenv'
// dotenv.config()
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// // Define the type for the environment variable
// type Environment = 'development' | 'production';
// const environment: Environment = (process.env.NODE_ENV as Environment) || 'production';
// const dbHost = process.env.RDS_HOSTNAME;
// const dbPort = process.env.RDS_PORT;
// const dbName = process.env.RDS_DB_NAME as string;
// const dbUser = process.env.RDS_USERNAME as string;
// const dbDriver = process.env.DB_DRIVER as Dialect;
// const dbPassword = process.env.RDS_PASSWORD as string;
// //dev
// const ddbHost = process.env.DRDS_HOSTNAME;
// const ddbPort = process.env.DRDS_PORT;
// const ddbName = process.env.DRDS_DB_NAME as string;
// const ddbUser = process.env.DRDS_USERNAME as string;
// const ddbDriver = process.env.DDB_DRIVER as Dialect;
// const ddbPassword = process.env.DRDS_PASSWORD as string;
// function getConnection() {
//   if (environment === 'production') {
//     // Production configuration
//     return new Sequelize(dbName, dbUser, dbPassword, {
//       host: dbHost,
//       port: parseInt(dbPort || '6543' ),
//       dialect: 'postgres',
//     });
//   } else {
//     // Development configuration
//     return new Sequelize(ddbName, ddbUser, ddbPassword, {
//       host: ddbHost,
//       port: parseInt(ddbPort || '6543' ),
//       dialect: 'postgres',
//     });
//   }
// }
// console.log('Connecting to the database...');
// Create the Sequelize connection
// const sequelizeConnection = getConnection();
// export default sequelizeConnection;
//Normal one
// import { Dialect, Sequelize } from 'sequelize';
// // Define the type for the environment variable
// type Environment = 'development' | 'production';
// const environment: Environment = (process.env.NODE_ENV as Environment) || 'development';
// function getConnection() {
//   if (environment === 'production') {
//     // Production configuration
//     return new Sequelize('postgres', 'postgres.kdkmgxbwpwlifkhiaeld', 'Ems_Task_Manegment_Production@123', {
//       host: 'aws-0-ap-south-1.pooler.supabase.com',
//       port: 6543,
//       dialect: 'postgres',
//     });
//   } else {
//     // Development configuration
//     return new Sequelize('postgres', 'postgres.bjqutidfqwpzeajjfpgk', 'EmstaskManegment@123', {
//       host: 'aws-0-ap-south-1.pooler.supabase.com',
//       port: 6543,
//       dialect: 'postgres',
//     });
//   }
// }
// console.log('Connecting to the database...');
// // Create the Sequelize connection
// const sequelizeConnection = getConnection();
// export default sequelizeConnection;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const environment = process.env.NODE_ENV || 'production';
// Production DB configurations
const dbHost = process.env.RDS_HOSTNAME;
const dbPort = process.env.RDS_PORT;
const dbName = process.env.RDS_DB_NAME;
const dbUser = process.env.RDS_USERNAME;
const dbDriver = process.env.DB_DRIVER;
const dbPassword = process.env.RDS_PASSWORD;
function getConnection() {
    if (environment === 'production') {
        console.log("Connecting to production DB...");
        return new sequelize_1.Sequelize(dbName, dbUser, dbPassword, {
            host: dbHost,
            port: parseInt(dbPort || '6543'),
            dialect: dbDriver,
        });
    }
    else {
        console.log("Connecting to development DB...");
        return new sequelize_1.Sequelize(process.env.DRDS_DB_NAME, process.env.DRDS_USERNAME, process.env.DRDS_PASSWORD, {
            host: process.env.DRDS_HOSTNAME,
            port: parseInt(process.env.DRDS_PORT || '6543'),
            dialect: process.env.DDB_DRIVER,
        });
    }
}
const sequelizeConnection = getConnection();
sequelizeConnection.authenticate()
    .then(() => {
    console.log('Database connected successfully');
})
    .catch((error) => {
    console.error('Unable to connect to the database:', error);
});
exports.default = sequelizeConnection;
