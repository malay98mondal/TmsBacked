"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const environment = process.env.NODE_ENV || 'production';
const dbHost = process.env.RDS_HOSTNAME;
const dbPort = process.env.RDS_PORT;
const dbName = process.env.RDS_DB_NAME;
const dbUser = process.env.RDS_USERNAME;
const dbDriver = process.env.DB_DRIVER;
const dbPassword = process.env.RDS_PASSWORD;
//dev
const ddbHost = process.env.DRDS_HOSTNAME;
const ddbPort = process.env.DRDS_PORT;
const ddbName = process.env.DRDS_DB_NAME;
const ddbUser = process.env.DRDS_USERNAME;
const ddbDriver = process.env.DDB_DRIVER;
const ddbPassword = process.env.DRDS_PASSWORD;
function getConnection() {
    if (environment === 'production') {
        // Production configuration
        return new sequelize_1.Sequelize(dbName, dbUser, dbPassword, {
            host: dbHost,
            port: parseInt(dbPort || '6543'),
            dialect: 'postgres',
        });
    }
    else {
        // Development configuration
        return new sequelize_1.Sequelize(ddbName, ddbUser, ddbPassword, {
            host: ddbHost,
            port: parseInt(ddbPort || '6543'),
            dialect: 'postgres',
        });
    }
}
console.log('Connecting to the database...');
// Create the Sequelize connection
const sequelizeConnection = getConnection();
exports.default = sequelizeConnection;
