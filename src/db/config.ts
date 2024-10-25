import { Dialect, Sequelize } from 'sequelize';

// Define the type for the environment variable
type Environment = 'development' | 'production';

const environment: Environment = (process.env.NODE_ENV as Environment) || 'development';

function getConnection() {
  if (environment === 'production') {
    // Production configuration
    return new Sequelize('postgres', 'postgres.kdkmgxbwpwlifkhiaeld', 'Ems_Task_Manegment_Production@123', {
      host: 'aws-0-ap-south-1.pooler.supabase.com',
      port: 6543,
      dialect: 'postgres',
    });
  } else {
    // Development configuration
    return new Sequelize('postgres', 'postgres.bjqutidfqwpzeajjfpgk', 'EmstaskManegment@123', {
      host: 'aws-0-ap-south-1.pooler.supabase.com',
      port: 6543,
      dialect: 'postgres',
    });
  }
}

console.log('Connecting to the database...');

// Create the Sequelize connection
const sequelizeConnection = getConnection();

export default sequelizeConnection;
