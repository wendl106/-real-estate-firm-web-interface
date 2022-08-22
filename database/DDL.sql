-- MySQL documentation recommends to turn off foreign key checks and autocommits at the beginning of SQL file.
SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;

-- CREATE TABLE SECTION--------------

DROP TABLE IF EXISTS `agents`;
CREATE TABLE `agents` (
    `agent_id` int(11) AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `location` varchar(255) NOT NULL,
    `ytd_sale` decimal(19,2) DEFAULT 0,
    PRIMARY KEY (`agent_id`),
    CONSTRAINT UNIQUE(`name`)
);

DROP TABLE IF EXISTS `client_types`;
CREATE TABLE `client_types` (
    `client_type_id` int(11) AUTO_INCREMENT,
    `description` varchar(255) NOT NULL,
    PRIMARY KEY (`client_type_id`)
);

DROP TABLE IF EXISTS `clients`;
CREATE TABLE `clients` (
    `client_id` int(11) AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `type` int,
    `agent_id` int NULL,
    PRIMARY KEY (`client_id`),
    FOREIGN KEY (`type`) REFERENCES `client_types` (`client_type_id`) ON DELETE SET NULL,
    FOREIGN KEY (`agent_id`) REFERENCES `agents` (`agent_id`) ON DELETE SET NULL
);

DROP TABLE IF EXISTS `agent_has_client_types`;
CREATE TABLE `agent_has_client_types` (
    `id` int(11) AUTO_INCREMENT,
    `agent_id` int NOT NULL,
    `client_type_id` int NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`agent_id`) REFERENCES `agents` (`agent_id`) ON DELETE CASCADE,
    FOREIGN KEY (`client_type_id`) REFERENCES `client_types` (`client_type_id`) ON DELETE CASCADE,
    CONSTRAINT UNIQUE (`agent_id`, `client_type_id`)
);

DROP TABLE IF EXISTS `sales`;
CREATE TABLE `sales` (
    `sale_id` int(11) AUTO_INCREMENT,
    `sale_date` date DEFAULT NULL,
    `price` decimal(19,2) NOT NULL,
    `agent_id` int,
    `property_id` int NOT NULL,
    PRIMARY KEY (`sale_id`),
    FOREIGN KEY (`agent_id`) REFERENCES `agents` (`agent_id`) ON DELETE SET NULL,
    FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`) ON DELETE CASCADE
);

DROP TABLE IF EXISTS `client_sales`;
CREATE TABLE `client_sales` (
    `id` int(11) AUTO_INCREMENT,
    `sale_id` int NOT NULL,
    `client_id` int NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`sale_id`) REFERENCES `sales` (`sale_id`) ON DELETE CASCADE,
    FOREIGN KEY (`client_id`) REFERENCES `clients` (`client_id`) ON DELETE CASCADE,
    CONSTRAINT UNIQUE (`sale_id`, `client_id`)
);

DROP TABLE IF EXISTS `properties`;
CREATE TABLE `properties` (
    `property_id` int(11) AUTO_INCREMENT,
    `address` varchar(255) NOT NULL,
    `city` varchar(50) NOT NULL,
    `year_built` int,
    `floor_area` int,
    `is_listed` tinyint DEFAULT 0 NOT NULL,
    `property_type` int NOT NULL,
    PRIMARY KEY (`property_id`),
    FOREIGN KEY (`property_type`) REFERENCES `property_types` (`property_type_id`) ON DELETE CASCADE
);

DROP TABLE IF EXISTS `property_types`;
CREATE TABLE `property_types` (
    `property_type_id` int(11) AUTO_INCREMENT,
    `description` varchar(255) NOT NULL,
    PRIMARY KEY (`property_type_id`)
);

-- INSERTION SECTION---------------------------

INSERT INTO `client_types` (`description`)
VALUES
('Conventional'),
('First Time Buyer'),
('VA'),
('Cash');

INSERT INTO `agents` (`name`, `location`, `ytd_sale`)
VALUES 
('Greg Larson', 'Corvalis', 750000.00),
('Amelia Wineheart', 'Portland', 600000.00),
('Scott John', 'Eugene', 250000.00),
('Julie Jones', 'Corvalis', 150000.00);

INSERT INTO `clients` (`name`, `type`, `agent_id`)
VALUES
('Miranda Lawson', (SELECT client_type_id FROM client_types WHERE description = 'VA'), (SELECT agent_id FROM agents WHERE name = 'Julie Jones')),
('Alex Sherman', (SELECT client_type_id FROM client_types WHERE description = 'Cash'), (SELECT agent_id FROM agents WHERE name = 'Scott John')),
('Gabriel Adams', (SELECT client_type_id FROM client_types WHERE description = 'Conventional'), (SELECT agent_id FROM agents WHERE name = 'Amelia Wineheart')),
('Leslie Colter', (SELECT client_type_id FROM client_types WHERE description = 'First Time Buyer'), (SELECT agent_id FROM agents WHERE name = 'Greg Larson')),
('Justin Lawson', (SELECT client_type_id FROM client_types WHERE description = 'VA'), (SELECT agent_id FROM agents WHERE name = 'Julie Jones'));

INSERT INTO `property_types` (`description`)
VALUES
('Townhouse'),
('Condominium'),
('Single Family Unit');

INSERT INTO `properties` (`address`, `city`, `year_built`, `floor_area`, `is_listed`, `property_type`)
VALUES
('123 Road St.', 'Corvalis', '1990', '2000', '1', (SELECT property_type_id FROM property_types WHERE description = 'Single Family Unit')),
('456 Avenue Ct.', 'Springville', '1999', '1500', '1', (SELECT property_type_id FROM property_types WHERE description = 'Condominium')),
('789 Loop Dr.', 'Gresham', '2010', '1750', '1', (SELECT property_type_id FROM property_types WHERE description = 'Townhouse')),
('100 Lunar Way', 'Lebanon', '1985', '1600', '0', (SELECT property_type_id FROM property_types WHERE description = 'Condominium'));

INSERT INTO `agent_has_client_types` (`agent_id`, `client_type_id`)
VALUES
((SELECT agent_id FROM agents WHERE name = 'Greg Larson'), (SELECT client_type_id FROM client_types WHERE description = 'Conventional')),
((SELECT agent_id FROM agents WHERE name = 'Amelia Wineheart'), (SELECT client_type_id FROM client_types WHERE description = 'VA')),
((SELECT agent_id FROM agents WHERE name = 'Greg Larson'), (SELECT client_type_id FROM client_types WHERE description = 'VA')),
((SELECT agent_id FROM agents WHERE name = 'Julie Jones'), (SELECT client_type_id FROM client_types WHERE description = 'Cash')),
((SELECT agent_id FROM agents WHERE name = 'Scott John'), (SELECT client_type_id FROM client_types WHERE description = 'First Time Buyer'));

INSERT INTO `sales` (`price`, `agent_id`, `property_id`)
VALUES
(250000.00, (SELECT agent_id FROM agents WHERE name = 'Scott John'), (SELECT property_id FROM properties WHERE address = '456 Avenue Ct.' AND city = 'Springville')),
(300000.00, (SELECT agent_id FROM agents WHERE name = 'Amelia Wineheart'), (SELECT property_id FROM properties WHERE address = '789 Loop Dr.' AND city = 'Gresham'));

INSERT INTO `sales` (`sale_date`, `price`, `agent_id`, `property_id`)
VALUES
('2021-10-07', 400000.00, (SELECT agent_id FROM agents WHERE name = 'Greg Larson'), (SELECT property_id FROM properties WHERE address = '100 Lunar Way' AND city = 'Lebanon'));

INSERT INTO `sales` (`price`, `agent_id`, `property_id`)
VALUES
(350000.00, (SELECT agent_id FROM agents WHERE name = 'Julie Jones'), (SELECT property_id FROM properties WHERE address = '123 Road St.' AND city = 'Corvalis'));


INSERT INTO `client_sales` (`sale_id`, `client_id`)
VALUES
((SELECT sale_id FROM clients
    INNER JOIN agents
    ON clients.agent_id = agents.agent_id
    INNER JOIN sales
    ON agents.agent_id = sales.agent_id
    WHERE clients.name = 'Alex Sherman'),
    (SELECT client_id FROM clients
    INNER JOIN agents
    ON clients.agent_id = agents.agent_id
    INNER JOIN sales
    ON agents.agent_id = sales.agent_id
    WHERE clients.name = 'Alex Sherman')),
((SELECT sale_id FROM clients
    INNER JOIN agents
    ON clients.agent_id = agents.agent_id
    INNER JOIN sales
    ON agents.agent_id = sales.agent_id
    WHERE clients.name = 'Gabriel Adams'),
    (SELECT client_id FROM clients
    INNER JOIN agents
    ON clients.agent_id = agents.agent_id
    INNER JOIN sales
    ON agents.agent_id = sales.agent_id
    WHERE clients.name = 'Gabriel Adams')),
((SELECT sale_id FROM clients
    INNER JOIN agents
    ON clients.agent_id = agents.agent_id
    INNER JOIN sales
    ON agents.agent_id = sales.agent_id
    WHERE clients.name = 'Leslie Colter'),
    (SELECT client_id FROM clients
    INNER JOIN agents
    ON clients.agent_id = agents.agent_id
    INNER JOIN sales
    ON agents.agent_id = sales.agent_id
    WHERE clients.name = 'Leslie Colter')),
((SELECT sale_id FROM clients
    INNER JOIN agents
    ON clients.agent_id = agents.agent_id
    INNER JOIN sales
    ON agents.agent_id = sales.agent_id
    WHERE clients.name = 'Miranda Lawson'),
    (SELECT client_id FROM clients
    INNER JOIN agents
    ON clients.agent_id = agents.agent_id
    INNER JOIN sales
    ON agents.agent_id = sales.agent_id
    WHERE clients.name = 'Miranda Lawson')),
((SELECT sale_id FROM clients
    INNER JOIN agents
    ON clients.agent_id = agents.agent_id
    INNER JOIN sales
    ON agents.agent_id = sales.agent_id
    WHERE clients.name = 'Justin Lawson'),
    (SELECT client_id FROM clients
    INNER JOIN agents
    ON clients.agent_id = agents.agent_id
    INNER JOIN sales
    ON agents.agent_id = sales.agent_id
    WHERE clients.name = 'Justin Lawson'));

-- Foreign key checks and autocommits turned back on at end of file.
SET FOREIGN_KEY_CHECKS = 1;
COMMIT;