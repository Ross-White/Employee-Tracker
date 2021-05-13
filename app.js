const inquirer = require('inquirer');
const mysql = require('mysql');
// require('console.table');
require('dotenv').config();

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
        case 'Exit':
          connection.end();
      }
    });
};

const viewAllEmployees = () => {
  connection.query(
    'SELECT employee.first_name, employee.last_name, role.title, department.name FROM employee LEFT JOIN role on employee.role_id = role.role_id LEFT JOIN department on role.role_id = department.department_id;',
    (err, res) => {
      if (err) throw err;
      console.table(res);
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
          results.forEach(({ department_id, name }) => {
            choiceArray.push({ name: name, value: department_id });
          });
          return choiceArray;
        },
        message: 'Please choose a department for the role.'
      }
    ])
      .then((answer) => {
        connection.query(
          'SELECT employee.first_name, employee.last_name, role.title, department.name FROM employee LEFT JOIN role on employee.role_id = role.role_id LEFT JOIN department department on role.department_id = department.department_id WHERE department.department_id = ?',
          answer.department_id, (err, res) => {
            if (err) throw err;
        console.table(res);
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
          'SELECT employee.first_name, employee.last_name, role.title, department.name FROM employee LEFT JOIN role on employee.role_id = role.role_id LEFT JOIN department department on role.department_id = department.department_id WHERE role.role_id = ?',
          answer.role_id, (err, res) => {
            if (err) throw err;
        console.table(res);
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


