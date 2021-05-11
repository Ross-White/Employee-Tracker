const inquirer = require('inquirer');
const mysql = require('mysql');
const { resolveSoa } = require('node:dns');
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
});

const create = () => {

};

const read = () => {
    // const query = 'SELECT employee.first_name, employee.last_name, role.title, role.salary FROM '
};

const update = () => {

};

const del = () => {

};
