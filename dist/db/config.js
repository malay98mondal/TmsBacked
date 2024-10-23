"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dbHost = process.env.RDS_HOSTNAME;
const dbPort = process.env.RDS_PORT;
const dbName = process.env.RDS_DB_NAME;
const dbUser = process.env.RDS_USERNAME;
const dbDriver = process.env.DB_DRIVER;
const dbPassword = process.env.RDS_PASSWORD;
function getConnection() {
    return new sequelize_1.Sequelize('postgres', 'postgres.bjqutidfqwpzeajjfpgk', 'EmstaskManegment@123', {
        host: 'aws-0-ap-south-1.pooler.supabase.com',
        port: 6543,
        dialect: 'postgres',
    });
}
console.log('backend');
const sequelizeConnection = getConnection();
exports.default = sequelizeConnection;
