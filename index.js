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

                    case 'Exit':
                        connection.end();
                        console.log('You have exited Employee Tracker');
                        break;
                }
            });
    }
    // View All Departments 
function viewAllDepartments() {
    db.query("SELECT * FROM department", (err, data) => {
        if (err) throw err;
        console.table(data);
        startApp();
    });
}
//View All Roles 
function viewAllRoles() {
    db.query("SELECT role.id, role.title, role.salary, department.department_name FROM role LEFT JOIN department ON role.department_id = department.id", (err, data) => {
        if (err) throw err;
        console.table(data);
        startApp();
    });
}
//View All Employees
function viewAllEmployees() {
    db.query("SELECT employee.id, employee.first_name, employee.last_name, role.role, department.department_name, role.salary, FROM employee x WHERE x.id = employee.manager_id) AS 'Manager' FROM employee LEFT JOIN role ON role.id = employee.role_id LEFT JOIN department ON role.department_id = department.id", (err, data) => {
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
                    console.log(`${answer.department} has been added to Employee Tracker.`);
                    startApp();
                }
            );
        });
}
// add Role
function addRole() {
    const sql = "SELECT * FROM department";
    db.query(sql, (err, res) => {
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
                        role: answer.role,
                        salary: answer.salary,
                        department_id: choice.id,
                    },
                    (err) => {
                        if (err) throw err;
                        console.log(`The role of ${answer.role} has been added to Employee Tracker.`);
                        startApp();
                    }
                );
            });
    });
}
// add Employee
function addEmployee() {
    const sql = "SELECT * FROM employee, role";
    connection.query
}

startApp();