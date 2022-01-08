const mysql = require('mysql2');
resquire('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'employee-tracker'
});

module.exports = db;