const mysql = require('mysql2');
require ('dotenv').config();

// Crear coneccion a la base de datos:
const connection = mysql.createConnection({
    host: process.env.HOST,
    port: process.env.DBPORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

connection.connect((err) => {
    if(err){
        console.log(err)
    } else {
        console.log('Conexion exitosa');
    }
});

module.exports = connection;