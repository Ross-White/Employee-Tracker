const inquirer = require('inquirer');
const mysql = require('mysql');
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
      'View all roles',
      'View all departments',
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
      case 'View all roles':
        viewAllRoles();
        break;
      case 'View all departments':
        viewAllDepartments();
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
      default:
          break;
      }  
  });
};