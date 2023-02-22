require('dotenv').config();
module.exports = {
    hostname: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    dialect: "mysql",
    port: process.env.DB_PORT,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};