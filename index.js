const inquirer = require('inquirer');
const db = require('./db/connections');
const consoleTable = require('console.table');




db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    user_prompt();
     });



function user_prompt() {
    //inquier prmopt
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'action',
            choices: [
                'View All Employees',
                'View All Departments',
                'View All Roles',
                'Add Employee',
                'Add Roles',
                'Add Department',
                'Update Employee Role',
                'Exit'
            ]
        }
    ]).then((answer) => {
        if(answer.action === 'View All Employees') {
            console.log('viewing');
        }
    })


}