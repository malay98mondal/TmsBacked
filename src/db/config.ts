// import { Dialect, Sequelize } from 'sequelize';
// import dotenv from 'dotenv'
// dotenv.config()

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

// import { Dialect, Sequelize } from 'sequelize';
// import dotenv from 'dotenv';
// dotenv.config();

// type Environment = 'development' | 'production';
// const environment: Environment = (process.env.NODE_ENV as Environment) || 'production';

// // Production DB configurations
// const dbHost = process.env.RDS_HOSTNAME;
// const dbPort = process.env.RDS_PORT;
// const dbName = process.env.RDS_DB_NAME as string;
// const dbUser = process.env.RDS_USERNAME as string;
// const dbDriver = process.env.DB_DRIVER as Dialect;
// const dbPassword = process.env.RDS_PASSWORD as string;

// function getConnection() {
//   if (environment === 'production') {
//     console.log("Connecting to production DB...");
//     return new Sequelize(dbName, dbUser, dbPassword, {
//       host: dbHost,
//       port: parseInt(dbPort || '6543'),
//       dialect: process.env.DB_DRIVER as Dialect,
//     });
//   } else {
//     console.log("Connecting to development DB...");
//     return new Sequelize(process.env.DRDS_DB_NAME as string, process.env.DRDS_USERNAME as string, process.env.DRDS_PASSWORD as string, {
//       host: process.env.DRDS_HOSTNAME,
//       port: parseInt(process.env.DRDS_PORT || '6543'),
//       dialect: process.env.DDB_DRIVER as Dialect,
//     });
//   }
// }

// const sequelizeConnection = getConnection();

// sequelizeConnection.authenticate()
//   .then(() => {
//     console.log('Database connected successfully');
//   })
//   .catch((error) => {
//     console.error('Unable to connect to the database:', error);
//   });

// export default sequelizeConnection;


import { Dialect, Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

type Environment = 'development' | 'production';
const environment: Environment = (process.env.NODE_ENV as Environment) || 'production';

// Production DB configurations
const dbHost = process.env.RDS_HOSTNAME;
const dbPort = process.env.RDS_PORT || '6543';
const dbName = process.env.RDS_DB_NAME as string;
const dbUser = process.env.RDS_USERNAME as string;
const dbPassword = process.env.RDS_PASSWORD as string;
const dbDriver: Dialect = (process.env.DB_DRIVER as Dialect) || 'postgres'; // Default to 'postgres'

// Development DB configurations
const devDbHost = process.env.DRDS_HOSTNAME;
const devDbPort = process.env.DRDS_PORT || '6543';
const devDbName = process.env.DRDS_DB_NAME as string;
const devDbUser = process.env.DRDS_USERNAME as string;
const devDbPassword = process.env.DRDS_PASSWORD as string;
const devDbDriver: Dialect = (process.env.DDB_DRIVER as Dialect) || 'postgres'; // Default to 'postgres'

function getConnection() {
  if (environment === 'production') {
    console.log("Connecting to production DB...");
    return new Sequelize(dbName, dbUser, dbPassword, {
      host: dbHost,
      port: parseInt(dbPort, 10),
      dialect: dbDriver, // Explicitly set dialect
    });
  } else {
    console.log("Connecting to development DB...");
    return new Sequelize(devDbName, devDbUser, devDbPassword, {
      host: devDbHost,
      port: parseInt(devDbPort, 10),
      dialect: devDbDriver, // Explicitly set dialect
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
    console.error(`Environment: ${environment}`);
    console.error(`DB Host: ${environment === 'production' ? dbHost : devDbHost}`);
    console.error(`DB Port: ${environment === 'production' ? dbPort : devDbPort}`);
    console.error(`Dialect: ${environment === 'production' ? dbDriver : devDbDriver}`);
  });

export default sequelizeConnection;
