// Declare dependencies
const db = require('./db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');

// Ask User what they want to do
const startApp = () => {
        return inquirer
            .prompt({
                type: 'list',
                name: 'options',
                message: 'What would you like to do?',
                choices: [
                    'View All Departments',
                    'View All Roles',
                    'View All Employees',
                    'Add Department',
                    'Add Role',
                    'Add Employee',
                    'Update Employee Role',
                    'Update Employee Manager',
                    'View All Employees by Role',
                    'View All Employees by Department',
                    'View All Employees by Manager',
                    'Remove Employee',
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

                    case 'Add Department':
                        addDepartment();
                        break;

                    case 'Add Role':
                        addRole();
                        break;

                    case 'Add Employee':
                        addEmployee();
                        break;

                    case 'Update Employee Role':
                        updateEmployeeRole();
                        break;

                    case 'Update Employee Manager':
                        updateEmployeeManager();
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

                    case 'Remove Employee':
                        removeEmployee();
                        break;

                    case 'Exit':
                        connection.end();
                        console.log('You have exited Employee Tracker');
                        break;
                }
            });
    }
    // View All Departments 
function viewAllDepartments() {
    connection.query("SELECT * FROM department", (err, data) => {
        if (err) throw err;
        console.table(data);
        startApp();
    });
}
//View All Roles 
function viewAllRoles() {
    connection.query("SELECT * FROM roles", (err, data) => {
        if (err) throw err;
        console.table(data);
        startApp();
    });
}
//View All Employees
function viewAllEmployees() {
    connection.query("SELECT * FROM employee", (err, data) => {
        if (err) throw err;
        console.table(data);
        startApp();
    });
}
// Add Department
function addDepartment() {
    inquirer.prompt([{
            name: 'department',
            type: 'input',
            message: 'What is the name of this department?'
        }, ])
        .then((answer) => {
            const query = 'INSERT INTO department SET ?';
            connection.query(
                query, {
                    name: answer.department,
                },
                (err) => {
                    if (err) throw err;
                    console.log(`S{answer.department} has been added to Employee Tracker.`);
                    startApp();
                }
            );
        });
}
// add Role
function addRole() {
    const sql = "SELECT * FROM department";
    connetion.query(sql, (err, res) => {
            if (err) throw err;
            inquirer
                .prompt([{
                        name: 'role',
                        type: 'input',
                        message: 'What is the name of this new role?',
                    },
                    {
                        name: 'salary',
                        type: 'input',
                        message: 'What is the salary for this role?'
                    },
                    {
                        name: 'department',
                        type: 'list',
                        choices: () => {
                            let roles = [];
                            for (let i = 0; i < res.length; i++) {
                                roles.push(res[i].name);
                            }
                            return roles;
                        },
                        message: 'What department does this role belong to?'
                    },

                ])
                .then((answer) => {
                        let choice;
                        for (let i = 0; i < res.length; i++) {
                            if (res(i).name === answer.department) {
                                choice = res[i];
                            }
                        }
                        connection.query("INSERT INTO role SET ?", {
                            title: answer.title,
                            salary: answer.salary,
                            department_id: choice.id,
                        }, )
                    }
                })
    }