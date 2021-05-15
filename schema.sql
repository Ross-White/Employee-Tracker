DROP DATABASE IF EXISTS employee_trackerDB;
CREATE database employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE department (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(30) NOT NULL,
);

CREATE TABLE role (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10, 2),
    department_id INT,
    CONSTRAINT `fk_role_dept`
    FOREIGN KEY (department_id)
    REFERENCES department(department_id)
    ON DELETE CASCADE
);

CREATE TABLE employee (
    employee_id INT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT NOT NULL,
    manager_id INT,
    CONSTRAINT `fk_emp_role`
	FOREIGN KEY (role_id)
	REFERENCES role(role_id)
	ON DELETE CASCADE
);