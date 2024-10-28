"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const environment = process.env.NODE_ENV || 'production';
function getConnection() {
    if (environment === 'production') {
        // Production configuration
        return new sequelize_1.Sequelize('postgres', 'postgres.kdkmgxbwpwlifkhiaeld', 'Ems_Task_Manegment_Production@123', {
            host: 'aws-0-ap-south-1.pooler.supabase.com',
            port: 6543,
            dialect: 'postgres',
        });
    }
    else {
        // Development configuration
        return new sequelize_1.Sequelize('postgres', 'postgres.bjqutidfqwpzeajjfpgk', 'EmstaskManegment@123', {
            host: 'aws-0-ap-south-1.pooler.supabase.com',
            port: 6543,
            dialect: 'postgres',
        });
    }
}
console.log('Connecting to the database...');
// Create the Sequelize connection
const sequelizeConnection = getConnection();
exports.default = sequelizeConnection;
