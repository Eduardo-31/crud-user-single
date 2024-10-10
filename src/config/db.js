require('dotenv').config();
const { Sequelize } = require("sequelize");


const db = new Sequelize({
    host: process.env.DB_HOST,           // 'localhost' o dirección IP
    username: process.env.DB_USER,       // tu nombre de usuario
    password: process.env.DB_PASSWORD,   // tu contraseña
    database: process.env.DB_NAME,       // nombre de la base de datos
    port: process.env.DB_PORT || 5432,  // Asegúrate de que este valor es correcto
    dialect: process.env.DB_DIALECT || 'postgres'         // puerto de la base de datos
  });

module.exports = db