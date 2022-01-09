const db = require('./db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');
const Connection = require('mysql2/typings/mysql/lib/Connection');

const options = () => {
    return inquirer
        .prompt({
            type: 'list',
            name: 'options',
            message: 'What would you like to do?',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'View All Employees by Role',
                'View All Employees by Department',
                'View All Employees by Manager',
                'Add Employee',
                'Add Department',
                'Add Role',
                'Remove Employee',
                'Update Employee Role',
                'Update Employee Manager',
                'Exit',
            ],
        })
        .then((answer) => {
            switch (answer.options) {
                case 'View All Departments':
                    viewAllDepartments();
                    break;

                case 'View All Roles':
                    viewAllRoles();
                    break;

                case 'View All Employees':
                    viewAllEmployees();
                    break;

                case 'View All Employees by Role':
                    viewAllEmployeesByRole();
                    break;

                case 'View All Employees by Department':
                    viewAllEmployeesByDepartment();
                    break;

                case 'View All Employees by Manager':
                    viewAllEmployeesByManager();
                    break;

                case 'Add Employee':
                    addEmployee();
                    break;

                case 'Add Department':
                    addDepartment();
                    break;

                case 'Add Role':
                    addRole();
                    break;

                case 'Remove Employee':
                    removeEmployee();
                    break;

                case 'Update Employee Role':
                    updateEmployeeRole();
                    break;

                case 'Update Employee Manager':
                    updateEmployeeManager();
                    break;

                case 'Exit':
                    connection.end();
                    console.log('You have exited Employee Tracker');
                    break;
            }
        });
}