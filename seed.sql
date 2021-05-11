USE employee_trackerDB;

INSERT INTO department (name)
VALUES ('Development'), ('Sales'), ('HR');

INSERT INTO role (title, salary, department_id)
VALUES ('Senior Developer', 50000, 1),
('Junior Developer', 30000, 1),
('Head of Sales', 100000, 2),
('Account Manager', 50000, 2),
('Sales Assistant', 25000, 2),
('Payroll Assistant', 25000, 3),
('HR Assitant', 25000, 3);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ('Ross', 'White', 1),
('Sue', 'Smith', 1),
('Jim', 'Jones', 2),
('Jill', 'James', 3),
('Dave', 'Davies', 5),
('Charlie', 'Chaplin', 4),
('Bilbo', 'Baggins', 6),
('Freddie', 'Flintstone', 5),
('Victor', 'Valdes', 7),
('Wiliam', 'Wallace', 4),
('Zinedine', 'Zidane', 7);
