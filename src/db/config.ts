// import { Dialect, Sequelize } from 'sequelize';

// // Define the type for the environment variable
// type Environment = 'development' | 'production';

// const environment: Environment = (process.env.NODE_ENV as Environment) || 'production';

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


import { Dialect, Sequelize } from 'sequelize';

// Define the environment variable type
type Environment = 'development' | 'production';

// Set the environment (default is 'production')
const environment: Environment = (process.env.NODE_ENV as Environment) || 'production';

// Function to get the database connection
function getConnection() {
  const config = {
    development: {
      database: process.env.DEV_DB_NAME || 'postgres',
      username: process.env.DEV_DB_USER || 'postgres.bjqutidfqwpzeajjfpgk',
      password: process.env.DEV_DB_PASSWORD || 'EmstaskManegment@123',
      host: process.env.DEV_DB_HOST || 'aws-0-ap-south-1.pooler.supabase.com',
      port: Number(process.env.DEV_DB_PORT) || 6543,
      dialect: 'postgres' as Dialect,
    },
    production: {
      database: process.env.PROD_DB_NAME || 'postgres',
      username: process.env.PROD_DB_USER || 'postgres.kdkmgxbwpwlifkhiaeld',
      password: process.env.PROD_DB_PASSWORD || 'Ems_Task_Manegment_Production@123',
      host: process.env.PROD_DB_HOST || 'aws-0-ap-south-1.pooler.supabase.com',
      port: Number(process.env.PROD_DB_PORT) || 6543,
      dialect: 'postgres' as Dialect,
    },
  };

  const envConfig = config[environment];

  return new Sequelize(envConfig.database, envConfig.username, envConfig.password, {
    host: envConfig.host,
    port: envConfig.port,
    dialect: envConfig.dialect,
    dialectOptions: {
      ssl: environment === 'production' ? { require: true, rejectUnauthorized: false } : undefined,
    },
    logging: false, // Set to `true` or `console.log` to enable query logs
  });
}

// Log database connection attempt
console.log(`Connecting to the database in ${environment} mode...`);

// Initialize Sequelize connection
const sequelizeConnection = getConnection();

// Authenticate the connection and log the result
async function connectToDatabase() {
  try {
    await sequelizeConnection.authenticate();
    console.log('Database connected successfully.');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
}

connectToDatabase();

export default sequelizeConnection;
