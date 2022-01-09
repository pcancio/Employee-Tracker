const mysql = require('mysql2');
resquire('dotenv').config();

// CONNECT TO THE DATABASE 
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
}, console.log('You are connected to the Employee Tracker Database'));

module.exports = db;