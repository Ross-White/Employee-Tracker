const inquirer = require('inquirer');
const mysql = require('mysql');
require('dotenv').config();
const Table = require('easy-table');


const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  start();
});

const start = () => {
  inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      'View all emloyees',
      'View employees by department',
      'View employees by role',
      'Add employee',
      'Add role',
      'Add department',
      'Update employee role',
      'Delete employee',
      'Delete role',
      'Delete department',
      'Department budget',
      'Exit',
    ]
  })
    .then((answer) => {
      switch (answer.action) {
        case 'View all emloyees':
          viewAllEmployees();
          break;
        case 'View employees by department':
          viewByDepartment();
          break;
        case 'View employees by role':
          viewByRole();
          break;
        case 'Add employee':
          addEmployee();
          break;
        case 'Add role':
          addRole();
          break;
        case 'Add department':
          addDepartment();
          break;
        case 'Update employee role':
          updateRole();
          break;
        case 'Delete employee':
          deleteEmployee();
          break;
        case 'Delete role':
          deleteRole();
          break;
        case 'Delete department':
          deleteDepartment();
          break;
        case 'Department budget':
          departmentBudget();
          break;
        case 'Exit':
          connection.end();
      }
    });
};

const viewAllEmployees = () => {
  connection.query(
    'SELECT employee.first_name, employee.last_name, role.title, department.department_name FROM employee LEFT JOIN role on employee.role_id = role.role_id LEFT JOIN department on role.role_id = department.department_id;',
    (err, res) => {
      if (err) throw err;
      console.log(Table.print(res));
      start();
    });
};

const viewByDepartment = () => {
  connection.query('SELECT * FROM department', (err, results) => {
    if (err) throw err;
    inquirer.prompt([
      {
        name: 'department_id',
        type: 'list',
        choices() {
          const choiceArray = [];
          results.forEach(({ department_id, department_name }) => {
            choiceArray.push({ name: department_name, value: department_id });
          });
          return choiceArray;
        },
        message: 'Please choose a department for the role.'
      }
    ])
      .then((answer) => {
        connection.query(
          'SELECT employee.first_name, employee.last_name, role.title, department.department_name FROM employee LEFT JOIN role on employee.role_id = role.role_id LEFT JOIN department department on role.department_id = department.department_id WHERE department.department_id = ?',
          answer.department_id, (err, res) => {
            if (err) throw err;
            console.log(Table.print(res));
            start();
          })
      });

  })
};

const viewByRole = () => {
  connection.query('SELECT * FROM role', (err, results) => {
    if (err) throw err;
    inquirer.prompt([
      {
        name: 'role_id',
        type: 'list',
        choices() {
          const choiceArray = [];
          results.forEach(({ role_id, title }) => {
            choiceArray.push({ name: title, value: role_id });
          });
          return choiceArray;
        },
        message: 'Please choose a role for the employee.'
      }
    ])
      .then((answer) => {
        console.log(answer.role_id);
        connection.query(
          'SELECT employee.first_name, employee.last_name, role.title, department.department_name FROM employee LEFT JOIN role on employee.role_id = role.role_id LEFT JOIN department department on role.department_id = department.department_id WHERE role.role_id = ?',
          answer.role_id, (err, res) => {
            if (err) throw err;
            console.log(Table.print(res));
            start();
          })
      });

  })
};

const addDepartment = () => {
  inquirer.prompt({
    name: 'name',
    type: 'input',
    message: 'Please type the name of the department'
  })
    .then(answer => {
      const query = connection.query(
        'INSERT INTO department SET ?',
        answer,
        (err, res) => {
          if (err) throw err;
          console.log(`${answer.name} department inserted`);
          start();
        }
      )
    })
};

const addRole = () => {
  connection.query('SELECT * FROM department', (err, results) => {
    if (err) throw err;
    inquirer.prompt([
      {
        name: 'title',
        type: 'input',
        message: 'Input the name of the role'
      },
      {
        name: 'salary',
        type: 'input',
        message: 'What is the salary for this role?'
      },
      {
        name: 'department_id',
        type: 'list',
        choices() {
          const choiceArray = [];
          results.forEach(({ department_id, name }) => {
            choiceArray.push({ name: name, value: department_id });
          });
          return choiceArray;
        },
        message: 'Please choose a department for the role.'
      }
    ])
      .then((answer) => {
        console.log(answer)
        connection.query(
          'INSERT INTO role SET ?',
          answer,
          (err, res) => {
            if (err) throw err;
            console.log(`${answer.title} role inserted`);
            start();
          }
        )
      })
  })
};

const addEmployee = () => {
  connection.query('SELECT * FROM role', (err, results) => {
    if (err) throw err;
    inquirer.prompt([
      {
        name: 'first_name',
        type: 'input',
        message: 'Input the employees first name'
      },
      {
        name: 'last_name',
        type: 'input',
        message: 'Input the employees last name'
      },
      {
        name: 'role_id',
        type: 'list',
        choices() {
          const choiceArray = [];
          results.forEach(({ role_id, title }) => {
            choiceArray.push({ name: title, value: role_id });
          });
          return choiceArray;
        },
        message: 'Please choose a role for the employee.'
      }
    ])
      .then((answer) => {
        connection.query(
          'INSERT INTO employee SET ?',
          answer,
          (err, res) => {
            if (err) throw err;
            console.log(`${answer.first_name}  ${answer.last_name}employee inserted`);
            start();
          }
        )
      })
  })
};

const updateRole = () => {
  connection.query(
    'SELECT employee.first_name, employee.last_name, employee.employee_id, role.title, role.role_id FROM employee LEFT JOIN role on employee.role_id = role.role_id;',
    (err, results) => {
      if (err) throw err;
      inquirer.prompt([
        {
          name: 'employee',
          type: 'list',
          choices() {
            let choiceArray = [];
            results.forEach(({ first_name, last_name, employee_id }) => {
              choiceArray.push({ name: first_name + ' ' + last_name, value: employee_id });
            });
            return choiceArray;
          },
          message: 'Please choose an employee to update.'
        },
        {
          name: 'role',
          type: 'list',
          choices() {
            let choiceArray = [];
            results.forEach(({ title, role_id }) => {
              choiceArray.push({ name: title, value: role_id });
            });
            return choiceArray;
          },
          message: 'Choose a new role for the employee.'
        }
      ]).then((answer) => {
        connection.query(
          'UPDATE employee SET ? WHERE ?;',
          [
            {
              role_id: answer.role,
            },
            {
              employee_id: answer.employee,
            }
          ],
          (err, res) => {
            if (err) throw err;
            console.log('Updated employee role.');
            start();
          }
        )
      });
    });
}

const deleteEmployee = () => {
  connection.query('SELECT first_name, last_name, employee_id FROM employee;', (err, results) => {
    if (err) throw err;
    inquirer.prompt([
      {
        name: 'employee_id',
        type: 'list',
        choices() {
          const choiceArray = [];
          results.forEach(({ employee_id, first_name, last_name }) => {
            choiceArray.push({ name: first_name + ' ' + last_name, value: employee_id });
          });
          return choiceArray;
        },
        message: 'Please choose an employee to delete.'
      }
    ])
      .then((answer) => {
        connection.query('DELETE FROM employee WHERE ?',
          {
            employee_id: answer.employee_id,
          },
          (err, res) => {
            if (err) throw err;
            console.log(`Employee deleted!\n`);
            start();
          })
      });
  });
};

const deleteRole = () => {
  connection.query('SELECT title, role_id FROM role;', (err, results) => {
    if (err) throw err;
    inquirer.prompt([
      {
        name: 'role_id',
        type: 'list',
        choices() {
          const choiceArray = [];
          results.forEach(({ role_id, title }) => {
            choiceArray.push({ name: title, value: role_id });
          });
          return choiceArray;
        },
        message: 'Please choose a role to delete.'
      }
    ])
      .then((answer) => {
        connection.query('DELETE FROM role WHERE role_id = ?',
          answer,
          (err, res) => {
            if (err) throw err;
            console.log(`Role deleted!\nPlease reassign employees.`);
            start();
          })
      });
  });
};

const deleteDepartment = () => {
  inquirer.prompt([
    {
      name: 'continue',
      type: 'list',
      message: "*** WARNING *** Deleting role will delete all employees associated with the role. Do you want to continue?",
      choices: ['yes', 'no'],
    }]).then((answer) => {
      if (answer.continue === 'no') {
        start();
      }
    }).then(() => {
      connection.query('SELECT department_name, department_id FROM department;', (err, results) => {
        if (err) throw err;
        inquirer.prompt([
          {
            name: 'department_id',
            type: 'list',
            choices() {
              const choiceArray = [];
              results.forEach(({ department_id, department_name }) => {
                choiceArray.push({ name: department_name, value: department_id });
              });
              return choiceArray;
            },
            message: 'Please choose a department to delete.',
          },
        ]).then((answer) => {
          connection.query('DELETE FROM department WHERE department_id = ?',
            answer,
            (err, res) => {
              if (err) throw err;
              console.log(`Department deleted!`);
              start();
            })
        });
      });
    });
}

const departmentBudget = () => {
  connection.query('SELECT * FROM department', (err, results) => {
    if (err) throw err;
    inquirer.prompt([
      {
        name: 'department_id',
        type: 'list',
        choices() {
          const choiceArray = [];
          results.forEach(({ department_id, department_name }) => {
            choiceArray.push({ name: department_name, value: department_id });
          });
          return choiceArray;
        },
        message: 'Please choose a department for the role.'
      }
    ])
      .then((answer) => {
        console.log(answer.department_id);
        connection.query('SELECT SUM(role.salary) AS Department_Budget FROM role LEFT JOIN department on role.department_id = department.department_id WHERE department.department_id = ?',
          answer.department_id,
          (err, res) => {
            if (err) throw err;
            console.log(Table.print(res));
            start();
          });
      });
  });
};
