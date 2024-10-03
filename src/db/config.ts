import { Dialect, Sequelize } from 'sequelize';

const dbHost = process.env.RDS_HOSTNAME;
const dbPort = process.env.RDS_PORT
const dbName = process.env.RDS_DB_NAME as string;
const dbUser = process.env.RDS_USERNAME as string;

const dbDriver = process.env.DB_DRIVER as Dialect;
const dbPassword = process.env.RDS_PASSWORD;

function getConnection() {
       return new Sequelize('postgres', 'postgres.bjqutidfqwpzeajjfpgk', 'EmstaskManegment@123', {
        host: 'aws-0-ap-south-1.pooler.supabase.com',
        port: 6543,
        dialect: 'postgres',
      });
}

console.log('backend');

const sequelizeConnection = getConnection()


export default sequelizeConnection;