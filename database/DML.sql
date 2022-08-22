-------------------------------------------------------------------------------
-----------------------------------CLIENTS-------------------------------------
-------------------------------------------------------------------------------
-- Show table on index page at route '/'

-- If there is no query string for client name or agent, simply display the client table data
SELECT client_id AS 'Client', name AS 'Name', type AS 'Type', agent_id as 'Agent' FROM clients;

-- If there is a query is a client name search
SELECT client_id AS 'Client', name AS 'Name', type AS 'Type', agent_id AS 'Agent' FROM clients WHERE name LIKE "${req.query.name}%";

-- If the query is for clients of a specific agent
SELECT client_id AS 'Client', name AS 'Name', type AS 'Type', agent_id AS 'Agent' FROM clients WHERE agent_id = "${req.query.agent}%";

-- SELECT queries used to populate the Clients table with meaningful text instead of FKs
SELECT agent_id AS 'Agent', name AS 'Name' FROM agents;
SELECT client_type_id AS 'id', description AS 'Type' FROM client_types;

-- INSERT new client
INSERT INTO clients (name, type, agent_id) VALUES ('${data['input-name']}', ${type}, ${agent});

-- UPDATE client's agent and SELECT query for updated data
UPDATE clients SET agent_id = ${agent} WHERE clients.client_id = ?;
SELECT * FROM agents WHERE agent_id = ?;

-- DELETE query for client
DELETE FROM clients WHERE client_id = ?;

-------------------------------------------------------------------------------
-----------------------------------CLIENTS-------------------------------------
-------------------------------------------------------------------------------

-------------------------------------------------------------------------------
-----------------------------------AGENTS--------------------------------------
-------------------------------------------------------------------------------
-- Show table on Agents page at route '/agents'

SELECT agent_id AS 'Agent', name AS 'Name', location AS 'Location', ytd_sale AS 'Year to Date Sales' FROM agents;

-- SELECT query to determine if the input name is already in the database (this will violate the CONSTRAINT UNIQUE(name))
SELECT COUNT(*) FROM agents WHERE name = '${data['input-name']}';

-- INSERT query for new agent
INSERT INTO agents (name, location, ytd_sale) VALUES ('${data['input-name']}', '${data['input-location']}', ${ytd_sales});

-------------------------------------------------------------------------------
-----------------------------------AGENTS--------------------------------------
-------------------------------------------------------------------------------

-------------------------------------------------------------------------------
-----------------------------------AGENT HAS CLIENT TYPES----------------------
-------------------------------------------------------------------------------
-- Show table on Agent Has Client Types page at route '/agent-has-client-types'

SELECT id AS 'ID', agent_id AS 'Agent', client_type_id AS `Client Type` FROM agent_has_client_types ORDER BY id ASC;
SELECT * FROM client_types;
SELECT agent_id AS 'Agent', name AS 'Name' FROM agents;

-- SELECT query to determine if the intersection table row is already in the database (this will violate the CONSTRAINT UNIQUE(agent_id, client_type_id))
SELECT COUNT(*) FROM agent_has_client_types WHERE agent_id = '${agent}' AND client_type_id = '${client_type}';

-- INSERT query for new agent has client type
INSERT INTO agent_has_client_types (agent_id, client_type_id) VALUES ('${agent}', ${client_type});

-- UPDATE query for agent has client type and SELECT query for updated data
UPDATE agent_has_client_types SET client_type_id = ? WHERE id = ?;
SELECT * FROM agent_has_client_types WHERE id = ?;

-- DELETE query for agent has client type
DELETE FROM agent_has_client_types WHERE id = ?;

-------------------------------------------------------------------------------
-----------------------------------AGENT HAS CLIENT TYPES----------------------
-------------------------------------------------------------------------------


-------------------------------------------------------------------------------
-----------------------------------CLIENT TYPES--------------------------------
-------------------------------------------------------------------------------
-- Show table on Client Types page at route '/client-types'
SELECT client_type_id AS 'ID', description AS 'Description' FROM client_types;

-- INSERT new client type
INSERT INTO client_types (description) VALUES ('${data['input-description']}');

-------------------------------------------------------------------------------
-----------------------------------CLIENT TYPES--------------------------------
-------------------------------------------------------------------------------

-------------------------------------------------------------------------------
-----------------------------------SALES---------------------------------------
-------------------------------------------------------------------------------
-- Show table on Sales page at route '/sales'
SELECT sale_id AS 'ID', sale_date AS 'Sale Date', price AS 'Price', agents.name AS 'Agent', properties.address AS 'Property' FROM sales INNER JOIN agents ON sales.agent_id = agents.agent_id INNER JOIN properties ON sales.property_id = properties.property_id ORDER BY sale_id ASC;
SELECT * FROM agents;
SELECT * FROM properties;

-- INSERT new sale for NULL sale_date
INSERT INTO sales (price, agent_id, property_id) VALUES ('${data['input-price']}', ${agent}, '${data['input-property']}');
-- INSERT new sale for user input sale_date
INSERT INTO sales (sale_date, price, agent_id, property_id) VALUES ('${date}', '${data['input-price']}', ${agent}, '${data['input-property']}');

-------------------------------------------------------------------------------
-----------------------------------SALES---------------------------------------
-------------------------------------------------------------------------------


-------------------------------------------------------------------------------
-----------------------------------CLIENT SALES--------------------------------
-------------------------------------------------------------------------------
-- Show table on Client Sales page at route '/client-sales'
SELECT id AS 'ID', client_sales.sale_id AS 'Sale ID', sales.sale_date AS 'Sale Date', address AS 'Address', client_sales.client_id AS 'Client ID', clients.name AS 'Client Name' FROM client_sales INNER JOIN sales ON client_sales.sale_id = sales.sale_id INNER JOIN properties ON sales.property_id = properties.property_id INNER JOIN clients ON client_sales.client_id = clients.client_id ORDER BY id ASC;
SELECT * FROM clients;
SELECT * FROM properties;

-- SELECT queries to find the sale_id for the user input sale date and property_id
SELECT sale_id FROM sales WHERE sales.sale_date is NULL AND sales.property_id = '${data['input-property']}';
SELECT sale_id FROM sales WHERE sales.sale_date = '${data['input-date']}' AND sales.property_id = '${data['input-property']}';

-- SELECT COUNT query to make sure this client sale does not already exist
SELECT COUNT(*) FROM client_sales WHERE client_id = '${data['input-client']}' AND sale_id = '${sale}';

-- INSERT new client sale
INSERT INTO client_sales (sale_id, client_id) VALUES ('${sale}', '${data['input-client']}');

-------------------------------------------------------------------------------
-----------------------------------CLIENT SALES--------------------------------
-------------------------------------------------------------------------------


-------------------------------------------------------------------------------
-----------------------------------PROPERTIES----------------------------------
-------------------------------------------------------------------------------
-- Show table on Properties page at route '/properties'
SELECT property_id AS 'Property', address AS 'Address', city AS 'City', year_built AS 'Year Built', floor_area AS 'Floor Area', is_listed AS 'Listed', property_type AS 'Type' FROM properties;
SELECT * FROM property_types;

-- INSERT query for properties
INSERT INTO properties (address, city, year_built, floor_area, is_listed, property_type) VALUES ('${data['input-address']}', '${data['input-city']}', ${year}, ${floor}, '${data['input-listed']}', '${data['input-type']}');

-------------------------------------------------------------------------------
-----------------------------------PROPERTIES----------------------------------
-------------------------------------------------------------------------------

-------------------------------------------------------------------------------
-----------------------------------PROPERTY TYPES------------------------------
-------------------------------------------------------------------------------
-- Show table on Property Types page at route '/property-types'
SELECT property_type_id AS 'ID', description AS 'Description' FROM property_types;

-- INSERT query for property types
INSERT INTO property_types (description) VALUES ('${data['input-description']}');

-------------------------------------------------------------------------------
-----------------------------------PROPERTY TYPES------------------------------
-------------------------------------------------------------------------------