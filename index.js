const sql = require('./db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');

sql.query('SELECT * FROM roles')