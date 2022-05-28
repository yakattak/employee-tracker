const connection = require('./db/connections');
const inquirer = require('inquirer');
const cTable = require('console-table');


connection.connect((error) => {
  if (error) throw error;
  console.log(`===========================`);
  console.log(`Welcome To Employee Manager`);
  console.log(`===========================`);
  commitPrompt();
});


//array for questions
const promptQuestions = [
    {
    name: 'action',
    type: 'list',
    message: 'Choose an option you want to commit',
    choices: [
      'View all department',
      'View all role',
      'View all employee',
      'Add a department',
      'Add a role',
      'Add an employee',
      'Update an employee\'s role',
      'Exit'
    ]
    }
  ];

  const commitPrompt = () => {

  inquirer.prompt(promptQuestions)
  .then((answers) => {

    if (answers.action == 'View all department') {
      viewAllDepartments();
    }
    else if (answers.action == 'View all role') {
      viewAllRoles();
    }
    else if (answers.action == 'View all employee') {
      viewAllEmployees();
    }
    else if (answers.action == 'Add a department') {
      addingDepartment();
    }
    else if (answers.action == 'Add a role') {
      addARole();
    }
    else if (answers.action == 'Add an employee') {
      addAnEmployee();
    }
    else if (answers.action == 'Update an employee\'s role') {
      updateEmployeeRole();
    }
    else if (answers.action == 'Exit'){
      connection.end();
    }
  });
};

const viewAllDepartments = () => {
  const sql =  "SELECT department.id AS id, department.dept_name AS department FROM department;"; 
  connection.query(sql, (err, res) => {
    if (err) throw err;
    console.log(`================`);
    console.log(`Departments List`);
    console.log(`================`);
    console.table(res);
    commitPrompt();
  });
};

const viewAllRoles = () => {
    const sql = `SELECT role.id, role.title, role.salary, department.dept_name AS department FROM role
    INNER JOIN department ON department.id = role.department_id;`;
    connection.query(sql, (err, res) => {
      if (err) throw err;
      console.log(`==========`);
      console.log(`Roles List`);
      console.log(`==========`);
      console.table(res);
      commitPrompt();
    })
  }
const viewAllEmployees = () => {
    const sql =   `SELECT employee.id, 
                  employee.first_name, 
                  employee.last_name, 
                  role.title, 
                  department.dept_name AS 'department', 
                  role.salary
                  FROM employee, role, department
                  WHERE department.id = role.department_id 
                  AND role.id = employee.role_id
                  ORDER BY employee.id ASC`;
    connection.query(sql, (err, res) => {
      if (err) throw err;
      console.log(`==============`);
      console.log(`Employees List`);
      console.log(`==============`);
      console.table(res);
      commitPrompt();
    })
  };
  const addADepartment =
    [
      {
        name: 'newDepartment',
        type: 'input',
        message: 'Enter new department name',
      }
    ]

  const addingDepartment = () => {
    inquirer.prompt(addADepartment)
    .then((answer) => {
      let sql = `INSERT INTO department(dept_name) VALUES (?)`;
      connection.query(sql, answer.newDepartment, (err, response) => {
        if (err) throw err;
        console.log(`===============================`);
        console.log(`You just added a new department`);
        console.log(`===============================`);
        viewAllDepartments();
      })
    })
  };
  const addARole = () => {
    const sql = 'SELECT * FROM department';
    connection.query(sql, (error, response) => {
      if (error) throw error;
      let departmentArray = [];
      response.forEach((department) => {departmentArray.push(department.dept_name)});
      departmentArray.push('Choose your department');
      inquirer.prompt([
        {
          name: 'yourDepartment',
          type: 'list',
          message: 'Choose your department',
          choices: departmentArray
        }
      ])
      .then((answer) => {
        if (answer.yourDepartment === 'Choose department') {
          this.addADepartment();
        } else {
          keepAddingrole(answer);
        }});
        const keepAddingrole = (departmentData) => {
          inquirer.prompt([{
            name: 'newRole',
            type: 'input',
            messsage: 'Enter new role name',
            //validate: validate.validateString
          },
        {
          name: 'salary',
          type: 'input',
          message: 'Enter your salary',
          //validate: validate.validateSalary
        }
      ])
      .then((answer) => {
        let aNewRole = answer.newRole;
        let departmentId;
        response.forEach((department) => {
          if (departmentData.yourDepartment === department.dept_name) {departmentId = department.id;}
        });
        let sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
        let roleArray = [aNewRole, answer.salary, departmentId];

        connection.query(sql, roleArray, (error) => {
          if (error) throw error;
          console.log(`=======================`);
          console.log(`You just add a new role`);
          console.log(`=======================`);
          viewAllRoles();
        })
      })
        }
      })
    };
    const addAnEmployee = () => {
      inquirer.prompt([{
        type: 'input',
        name: 'firstName',
        message: 'Enter employee\'s first name',
        validate: addFirstName => {
          if (addFirstName) {
            return true;
          } else {
            console.log('First name is required');
            return false;
          }
        }
      },
      {
        type: 'input',
        name: 'lastName',
        message: 'Enter employee\'s last name',
        validate: addLastName => {
          if (addLastName) {
            return true;
          } else {
            console.log('Last name is required');
            return false;
          }
          }
        }
    ])
    .then(answer => {
      const addEmployee = [answer.firstName, answer.lastName];
      const roleSql = `SELECT role.id, role.title FROM role`;
      connection.query(roleSql, (error, data) => {
        if (error) throw error;
        const roleList = data.map(({ id, title }) => ({ name: title, value: id}));
        inquirer.prompt([
          {
            type: 'list',
            name: 'roleList',
            message: 'Enter employee\'s role',
            choices: roleList
          }
        ])
        .then(chosenRole => {
          const aRole = chosenRole.role;
          addEmployee.push(aRole);
          const managerSql = `SELECT * FROM employee`;
          connection.query(managerSql, (error, data) => {
            if (error) throw error;
            const managerList = data.map(({ id, first_name, last_name}) => ({ name: first_name + "" + last_name, value: id}));
            inquirer.prompt([
              {
                type: 'list',
                name: 'managerList',
                message: 'Enter employee\'s manager',
                choices: managerList
              }
            ])
            .then(chooseManager => {
              const manager = chooseManager.manager;
              addEmployee.push(manager);
              const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
              connection.query(sql, addEmployee, (error) => {
                if (error) throw error;
                console.log('You just added an employee');
                viewAllEmployees();
              });
            });
          })
        });
      });
    });
    };
    const updateEmployeeRole = () => {
      let sql = `SELECT employee.id, employee.first_name, employee.last_name, role.id AS "role_id"
      FROM employee, role, department WHERE department.id = role.department_id AND role.id = employee.role_id`;
      connection.query(sql, (error, response) => {
        if (error) throw error;
        let employeeArray = [];
        response.forEach((employee) => {employeeArray.push(`${employee.first_name} ${employee.last_name}`)});
        let sql = `SELECT role.id, role.title FROM role`;
        connection.query(sql, (error, response) => {
          if (error) throw error;
        let roleArray = [];
        response.forEach((role) => {
          roleArray.push(role.title)});
          inquirer.prompt([
            {
              name: 'chooseEmployee',
              type: 'list',
              message: 'Choose an employee who will have a new role',
              choices: employeeArray
            },
            {
              name: 'chooseRole',
              type: 'list',
              message: 'Enter a new role',
              choices: roleArray
            }
          ])
          .then((answer) => {
            let newId, employeeId;
            response.forEach((role) => {
              if (answer.chooseRole === role.title)
              {newId = role.id;
              }
            });
            response.forEach((employee) => {
              if (answer.chooseEmployee === `${employee.first_name} ${employee.last_name}`) 
            {
              employeeId = employee.id;
            }
          });

          let sqls = `UPDATE employee SET employee.role_id = ? WHERE employee.id =?`;
          connection.query(sqls,
            [newId, employeeId],
            (error) => {
              if (error) throw error;
              console.log(`=================================`);
              console.log(`You just updated employee\'s role`);
              console.log(`=================================`);
              viewAllEmployees();
              commitPrompt();
            }
          );
        });
      });
    });
  };