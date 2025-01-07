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

// Define the type for the environment variable
type Environment = 'development' | 'production';

const environment: Environment = (process.env.NODE_ENV as Environment) || 'production';

function getConnection() {
    const config = {
        production: {
            database: 'postgres',
            username: 'postgres.kdkmgxbwpwlifkhiaeld',
            password: 'Ems_Task_Manegment_Production@123',
            host: 'aws-0-ap-south-1.pooler.supabase.com',
            port: 6543,
            dialect: 'postgres' as Dialect,
        },
        development: {
            database: 'postgres',
            username: 'postgres.bjqutidfqwpzeajjfpgk',
            password: 'EmstaskManegment@123',
            host: 'aws-0-ap-south-1.pooler.supabase.com',
            port: 6543,
            dialect: 'postgres' as Dialect,
        },
    };

    const envConfig = config[environment];
    return new Sequelize(envConfig.database, envConfig.username, envConfig.password, {
        host: envConfig.host,
        port: envConfig.port,
        dialect: envConfig.dialect,
        logging: console.log,
    });
}

console.log('Connecting to the database...');
const sequelizeConnection = getConnection();

sequelizeConnection.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

export default sequelizeConnection;
