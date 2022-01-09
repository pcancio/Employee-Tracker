INSERT INTO department (name) 
VALUES ('Sales'),
('Engineering'),
('Finance'),
('Legal');

INSERT INTO role (title, salary, department_id),
VALUES ('Sales Director', 100000, 1),
('Sales Assistant', 90000, 1),
('Engineering Manager', 100000, 2),
('Engineering Associate', 90000, 2),
('Finance Director', 100000, 3),
('Finance Analyst', 80000, 3),
('Head of Compliance', 100000, 4),
('Staff Lawyer', 90000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id),
VALUES ('Adam', 'Apple', 1, null),
('Ben', 'Brown', 2, 1),
('Candy', 'Chu', 2, null),
('Diana', 'Dee', 3, 2)
('Eric', 'Escobar', 4, null),
('Frieda', 'Frank', 5, 4),
('Gary', 'Garcia', 6, 4),
('Hans', 'Hu', 7, null),
('India', 'Irving', 8, 7),
('Jane', 'Johnson', 8, 7);

