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
                'Exit'
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

                case 'Exit':
                    db.end();
                    console.log('You have exited Employee Tracker');
                    break;
            }
        });
};
// View All Departments 
function viewAllDepartments() {
    db.query("SELECT * FROM department", (err, data) => {
        if (err) throw err;
        console.table(data);
        startApp();
    });
};
//View All Roles 
function viewAllRoles() {
    db.query("SELECT roles.id, roles.title, roles.salary, department.department_name FROM roles LEFT JOIN department ON roles.department_id = department.id", (err, data) => {
        if (err) throw err;
        console.table(data);
        startApp();
    });
};
//View All Employees
function viewAllEmployees() {
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.department_name AS 'department', roles.salary, employee.manager_id  
    FROM employee LEFT JOIN roles ON roles.id = employee.role_id 
    LEFT JOIN department ON roles.department_id = department.id`, (err, data) => {
        if (err) throw err;
        console.table(data);
        startApp();
    });
};
// Add Department
function addDepartment() {
    inquirer.prompt([{
            name: 'department',
            type: 'input',
            message: 'What is the name of this department?'
        }, ])
        .then((answer) => {
            const query = 'INSERT INTO department SET department_name = ?';
            db.query(
                query, answer.department,
                (err) => {
                    if (err) throw err;
                    console.log(`${answer.department} has been added to Employee Tracker.`);
                    startApp();
                }
            );
        });
}
// Add Role
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
                        let role = [];
                        for (let i = 0; i < res.length; i++) {
                            let newObj = {
                                id: res[i].id,
                                name: res[i].department_name
                            }
                            role.push(newObj);
                        }
                        return role;
                    },
                    message: 'What department does this role belong to?'
                },

            ])
            .then((answer) => {
                let choiceID;
                for (let i = 0; i < res.length; i++) {
                    if (res[i].department_name === answer.department) {
                        choiceID = res[i].id;
                    }
                }
                db.query("INSERT INTO roles SET ?", {
                        title: answer.role,
                        salary: answer.salary,
                        department_id: choiceID,
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
// Add Employee
function addEmployee() {
    const sql = "SELECT * FROM roles";
    db.query(sql, (err, res) => {
        if (err) throw err;
        inquirer
            .prompt([{
                    name: 'first_name',
                    type: 'input',
                    message: 'Enter first name',
                },
                {
                    name: 'last_name',
                    type: 'input',
                    message: 'Enter last name',
                },
                {
                    name: 'role',
                    type: 'list',
                    choices: () => {
                        let role = [];
                        for (let i = 0; i < res.length; i++) {
                            role.push(res[i].title);
                        }
                        return role;
                    },
                    message: 'Select role.',
                },
            ])
            .then((answer) => {
                let roleChoice;
                for (let i = 0; i < res.length; i++) {
                    if (res[i].title === answer.role) {
                        roleChoice = res[i].id;
                    }
                }
                db.query(
                    "INSERT INTO employee SET ?", {
                        first_name: answer.first_name,
                        last_name: answer.last_name,
                        role_id: roleChoice
                    },
                    (err) => {
                        if (err) throw err;
                        console.log(`${answer.first_name} ${answer.last_name} has been added to database.`)
                        startApp();
                    }
                )
            })
    })
};
// Update Employee Role - 4 steps
// 1. Get all employees 

function getEmployees() {
    return new Promise(function(resolve, reject) {
        var query = 'SELECT * from employee';
        db.query(query, function(err, res) {
            if (err) throw err;
            const employeeOptions = []
            for (let i = 0; i < res.length; i++) {
                let fullName = res[i].first_name + " " + res[i].last_name
                employeeOptions.push(fullName)
            }
            resolve(employeeOptions)
        })
    })
}

// 2. get all roles
function getRoles() {
    return new Promise(function(resolve) {
        var query = 'SELECT roles.title FROM roles';
        db.query(query, function(err, res) {
            if (err) throw err;
            const roleOptions = []
            for (let i = 0; i < res.length; i++) {
                roleOptions.push(res[i].title)
            }
            resolve(roleOptions)
        })
    })
}
// 3. get Employee IDs
function getEmployeeID(name) {
    return new Promise(function(resolve) {
        var query = 'SELECT employee.id FROM employee WHERE CONCAT(first_name, " " ,last_name) = ?';
        db.query(query, [name], function(err, res) {
            if (err) throw err;
            resolve(res[0].id)
        })
    })
}
// 4. get role IDs
function getRoleID(title) {
    return new Promise(function(resolve) {
        var query = 'SELECT roles.id FROM roles';
        db.query(query, function(err, res) {
            if (err) throw err;
            resolve(res[0].id)
        })
    })
}

// combine the results of the previous four Get functions to Update the Employee Role

async function updateEmployeeRole() {
    var allEmployees = await getEmployees()
    var allRoles = await getRoles()
    inquirer
        .prompt([{
                name: 'employee',
                type: 'list',
                message: 'Select the employee to update.',
                choices: allEmployees
            },
            {
                name: 'role',
                type: 'list',
                message: 'Select their new role.',
                choices: allRoles
            },
        ])
        .then(async function(answer) {
            var employeeID = await getEmployeeID(answer.employee)
            var roleID = await getRoleID(answer.role)
            var query = 'UPDATE employee SET employee.role_id = ? WHERE employee.id = ?';
            db.query(
                query, [roleID, employeeID],
                function(err, res) {
                    if (err) throw err;
                    console.log('The employee role is updated');
                    startApp();
                }
            );
        })

}







// function updateEmployeeRole() {
//     const sql = ('SELECT * from employee, roles')
//     db.query(sql, (err, res) => {
//         if (err) throw err;
//         
//                     choices: () => {
//                         let new = [];
//                         for (let i = 0; i < res.length; i++) {
//                             new.push(res[i].last_name);
//                         }
//                         let updated = [...new Set (employee)];
//                         return updated;
//                     },
//                     message: 'Select the employee to update.'
//                 },

//                 {
//                     name: 'title',
//                     type: 'list',
//                     choices: () => {
//                         let updatedRole = [];
//                         for (let i = 0; i < res.length; i++) {
//                             let newObj = {
//                                 id: res[i].id,
//                                 name: res[i].title
//                             }
//                             updatedRole.push(newObj);
//                         }
//                         return updatedRole;
//                     },
//                     message: 'Select their new role.'
//                 },
//             ])
//     })
// };


// // .then((








// //                     }
// //                     let employees = [];
// //                     const employeeChoices = employees.map(({ id, last_name }) => ({




// //                         choices: () => {
// //                             let role = [];
// //                             for (let i = 0; i < res.length; i++) {
// //                                 let newObj = {
// //                                     id: res[i].id,
// //                                     name: res[i].department_name
// //                                 }
// //                                 role.push(newObj);
// //                             }
// //                             return role;
// //                         },
// //                         message: 'What department does this role belong to?'


// //                             for (let i = 0; i < res.length; i++) {
// //                             let newObj = {
// //                                 id: res[i].id,
// //                                 name: res[i].department_name
// //                             }
// //                             role.push(newObj);
// //                         }
// //                         return role;
// //                         name: last_name,
// //                         value: id
// //                     }));
// //                     const roleChoices = employees.map(({ role_id, title }) => ({
// //                         name: title,
// //                         value: role_id
// //                     }));

// //                 ])
// //                 .then(answer => {
// //                     db.updateEmployeeRole(answer.title, answer.last_name)
// //                     console.log(`${answer.last_name} is now ${answer.title}`);
// //                     startApp();
// //                 })
// //             })
// // };













// //     query('SELECT * FROM employee, roles', (err, res) => {
// //         if (err) throw err;
// //         inquirer
// //             .prompt([{
// //                     name: 'employee',
// //                     type: 'list',
// //                     choices: () => {
// //                         let employees = [];
// //                         for (let i = 0; i < res.length; i++) {
// //                             employees.push(res[i].last_name);
// //                         }
// //                         let choiceArray = [...new Set(employees)];
// //                         return choiceArray;
// //                     },
// //                     message: 'Select the employee to update.'
// //                 },
// //                 {
// //                     name: 'role',
// //                     type: 'list',
// //                     choices: () => {
// //                         let roles = [];
// //                         for (let i = 0; i < res.length; i++) {
// //                             roles.push(res[i].title);
// //                         }
// //                         let choiceArray = [...new Set(roles)];
// //                         return choiceArray;
// //                     },
// //                     message: 'Select the new role for the employee.'
// //                 },
// //             ])
// //             .then((answer) => {
// //                 let updateEmployee;
// //                 let updateRole;

// //                 for (let i = 0; i < res.length; i++) {
// //                     if (res[i].last_name === answer.employees) {
// //                         updateEmployee = res[i].employees
// //                     }
// //                 }
// //                 for (let i = 0; i < res.length; i++) {
// //                     if (res[i].last_name === answer.roles) {
// //                         updateRole = res[i].roles
// //                     }
// //                 }
// //                 db.query('UPDATE employee SET ? WHERE ?', [{ role_id: updateRole, },
// //                         { last_name: updateEmployee, },
// //                     ],
// //                     (err) => {
// //                         if (err) throw err;
// //                         console.log('update successful!');
// //                         startApp();
// //                     }
// //                 );
// //             });
// //     });
// // }


startApp();