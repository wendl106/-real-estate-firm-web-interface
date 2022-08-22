// App.js

/*
    SETUP
*/
const engine = require('express-handlebars'); // Use handlebars for templating
var express = require('express');             // User Express library for web server
var app     = express();                      // We need to instantiate an express object to interact with the server in our code

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))

PORT        = 6970;                               // Set port

var db      = require('./database/db-connector'); // Configure database

app.engine('.hbs', engine({extname: ".hbs"}));    // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                   // Tell express to use the handlebars engine whenever it encounters a *.hbs file.


/*
    ROUTES
*/
// Get route for displaying Client Info
app.get('/', function(req, res)
    { 
        // Initialize query1
        let query1;

        // If there is no query string for client name or agent, simply display the client table data
        if ((req.query.name === undefined || req.query.name === "")  && (req.query.agent === undefined || req.query.agent === ""))
        {
            query1 = "SELECT client_id AS 'Client', name AS 'Name', type AS 'Type', agent_id as 'Agent' FROM clients;";
        }

        // If there is a query string, but agent is undefined then it is a client name search
        else if (req.query.agent === undefined)
        {
            query1 = `SELECT client_id AS 'Client', name AS 'Name', type AS 'Type', agent_id AS 'Agent' FROM clients WHERE name LIKE "${req.query.name}%"`
        }
        // else the query is for clients of a specific agent
        else
        {
            query1 = `SELECT client_id AS 'Client', name AS 'Name', type AS 'Type', agent_id AS 'Agent' FROM clients WHERE agent_id = "${req.query.agent}%"`;
        }

        let query2 = "SELECT agent_id AS 'Agent', name AS 'Name' FROM agents;";
        let query3 = "SELECT client_type_id AS 'id', description AS 'Type' FROM client_types;"

        db.pool.query(query1, function(error, rows, fields){

            let clients = rows;

            db.pool.query(query2, function(error, rows, fields){

                let agents = rows;

                // Map the agent_id key to the agent's actual name
                let agentmap = {}
                agents.map(agent => {
                    let id = parseInt(agent.Agent, 10);
                    agentmap[id] = agent["Name"];
                })

                db.pool.query(query3, function(error, rows, fields){

                    let client_types = rows;
                    let client_typemap = {}

                    // Map the client_type_id key to the client_type's description
                    client_types.map(client_type => {
                        let id = parseInt(client_type.id, 10);
                        client_typemap[id] = client_type["Type"]
                    })

                    // Overwrite the agent_id with the agent's name and the client_type_id with the client_type description
                    clients = clients.map(client => {
                        return Object.assign(client, {Agent: agentmap[client.Agent]}, {Type: client_typemap[client.Type]})
                    })
                    // Render the index handlebars template with this data
                    res.render('index', {data: clients, agents: agents, client_types: client_types});
                })
            })
        })
    });

// Get route for displaying agent_has_client_types intersection table
app.get('/agent-has-client-types', function(req, res)
    {
        let query1 = "SELECT id AS 'ID', agent_id AS 'Agent', client_type_id AS `Client Type` FROM agent_has_client_types ORDER BY id ASC;";
        let query2 = "SELECT * FROM client_types;"
        let query3 = "SELECT agent_id AS 'Agent', name AS 'Name' FROM agents;"

        db.pool.query(query1, function(error, rows, fields){    // Execute the query

            let agent_has_client_types = rows;

            db.pool.query(query2, function(error, rows, fields){

                let client_types = rows;
                
                // Map the client_type.description to the client_type_id
                let client_typemap = {}
                client_types.map(client_type => {
                    let id = parseInt(client_type.client_type_id, 10);
                    client_typemap[id] = client_type["description"];
                })

                db.pool.query(query3, function(error, rows, fields){
                    let agents = rows;

                    // Map the agent's name to the agent_id
                    let agentmap = {}
                    agents.map(agent => {
                        let id = parseInt(agent.Agent, 10);
                        agentmap[id] = agent["Name"];
                    })

                    // Overwrite the client_type_id with the client_type description and the agent_id with the agent's name
                    agent_has_client_types = agent_has_client_types.map(agent_has_client_type => {
                        return Object.assign(agent_has_client_type, {"Client Type": client_typemap[agent_has_client_type['Client Type']]}, {Agent: agentmap[agent_has_client_type.Agent]})
                    })
                    

                    res.render('agent_has_client_types', {data: agent_has_client_types, client_types: client_types, agents: agents});

                })
            })
        })
    });  

// Get route for displaying properties
app.get('/properties', function(req, res)
    {
        let query1 = "SELECT property_id AS 'Property', address AS 'Address', city AS 'City', year_built AS 'Year Built', floor_area AS 'Floor Area', is_listed AS 'Listed', property_type AS 'Type' FROM properties;";
        let query2 = "SELECT * FROM property_types;";

        db.pool.query(query1, function(error, rows, fields){
            let properties = rows;

            db.pool.query(query2, function(error, rows, fields){

                let property_types = rows;

                // Map the agent_id key to the agent's actual name
                let property_typemap = {}
                property_types.map(property_type => {
                    let id = parseInt(property_type.property_type_id, 10);
                    property_typemap[id] = property_type["description"];
                })

                let listing_types = [{
                    id: 0,
                    description: "Not Listed"
                },
                {
                    id: 1,
                    description: "Listed"
                }
                    ];

                let is_listed_typemap = {
                    0: "No",
                    1: "Yes"
                }
                
                
                // Overwrite the is_listed bool with Yes/No, and overwrite property_type to be property_types.description
                properties = properties.map(property => {
                    return Object.assign(property, {Type: property_typemap[property.Type]}, {Listed: is_listed_typemap[property.Listed]})
                })
                // Render the index handlebars template with this data
                res.render('properties', {data: properties, property_types: property_types, listing_types: listing_types});
            })
        })
    });

// Get route for displaying agents
app.get('/agents', function(req, res)
    {
        let query1 = "SELECT agent_id AS 'Agent', name AS 'Name', location AS 'Location', ytd_sale AS 'Year to Date Sales' FROM agents;";

        db.pool.query(query1, function(error, rows, fields){
            let agents = rows;

            res.render('agents', {data: agents});
        })
    });

// Get route for displaying client types
app.get('/client-types', function(req, res)
    {
        let query1 = "SELECT client_type_id AS 'ID', description AS 'Description' FROM client_types;";
        db.pool.query(query1, function(error, rows, fields){
            let client_types = rows;
            res.render('client_types', {data: client_types});
        })
        
    });

// Get route for displaying sales
app.get('/sales', function(req, res)
    {
        let query1 = "SELECT sale_id AS 'ID', sale_date AS 'Sale Date', price AS 'Price', agents.name AS 'Agent', properties.address AS 'Property' FROM sales INNER JOIN agents ON sales.agent_id = agents.agent_id INNER JOIN properties ON sales.property_id = properties.property_id ORDER BY sale_id ASC;";
        let query2 = "SELECT * FROM agents;";
        let query3 = "SELECT * FROM properties;";
        db.pool.query(query1, function(error, rows, fields){
            let sales = rows;

            db.pool.query(query2, function(error, rows, fields){
                let agents = rows;

                db.pool.query(query3, function(error, rows, fields){
                    let properties = rows;
                    res.render('sales', {data: sales, agents: agents, properties: properties});
                })
            })

            
        })
    });

// Get route for displaying client sales
app.get('/client-sales', function(req, res)
    {
        let query1 = "SELECT id AS 'ID', client_sales.sale_id AS 'Sale ID', sales.sale_date AS 'Sale Date', address AS 'Address', client_sales.client_id AS 'Client ID', clients.name AS 'Client Name' FROM client_sales INNER JOIN sales ON client_sales.sale_id = sales.sale_id INNER JOIN properties ON sales.property_id = properties.property_id INNER JOIN clients ON client_sales.client_id = clients.client_id ORDER BY id ASC;";
        let query2 = "SELECT * FROM clients";
        let query3 = "SELECT * FROM properties";
        db.pool.query(query1, function(error, rows, fields){
            let client_sales = rows;

            db.pool.query(query2, function(error, rows, fields){
                let clients = rows;

                db.pool.query(query3, function(error, rows, fields){
                    let properties = rows;

                    res.render('client_sales', {data: client_sales, clients: clients, properties: properties});
                })
            })
            
        })
    });

// Get route for displaying property types
app.get('/property-types', function(req, res)
    {
        let query1 = "SELECT property_type_id AS 'ID', description AS 'Description' FROM property_types;";
        db.pool.query(query1, function(error, rows, fields){
            let property_types = rows;
            res.render('property_types', {data: property_types});
        })
    });

// Post route for adding a new client
app.post('/add-client-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let agent = parseInt(data['input-agent']);
    if (isNaN(agent))
    {
        agent = 'NULL'
    }

    let type = parseInt(data['input-type']);
    if (isNaN(type))
    {
        type = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO clients (name, type, agent_id) VALUES ('${data['input-name']}', ${type}, ${agent})`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/');
        }
    })
})



// Post route for adding a new entry into agent_has_client_types
app.post('/add-agent-has-client-type-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let agent = parseInt(data['input-agent']);
    let client_type = parseInt(data['input-type']);
    if (isNaN(agent))
    {
        res.redirect('/agent-has-client-types');
    } else if (isNaN(client_type))
    {
        res.redirect('/agent-has-client-types');
    } else {
        query1 = `SELECT COUNT(*) FROM agent_has_client_types WHERE agent_id = '${agent}' AND client_type_id = '${client_type}'`;
        db.pool.query(query1, function(error, rows, fields){
            let count = Object.values(JSON.parse(JSON.stringify(rows)))[0]['COUNT(*)'];
            if (error) {
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);

            } else if (count !== 0) {
                res.redirect('/agent-has-client-types');

            } else {
                query2 = `INSERT INTO agent_has_client_types (agent_id, client_type_id) VALUES ('${agent}', ${client_type})`;
                db.pool.query(query2, function(error, rows, fields){

                    // Check to see if there was an error
                    if (error) {
            
                        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                        console.log(error)
                        res.sendStatus(400);
                    }
            
                    // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
                    // presents it on the screen
                    else {
                    res.redirect('/agent-has-client-types');
                    }
                })
            }
        })
    }
})

// Post route for adding a new property
app.post('/add-property-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let year = data['input-year'];
    if (year === "")
    {
        year = 'NULL'
    }

    let floor = parseInt(data['input-floor']);
    if (isNaN(floor))
    {
        floor = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO properties (address, city, year_built, floor_area, is_listed, property_type) VALUES ('${data['input-address']}', '${data['input-city']}', ${year}, ${floor}, '${data['input-listed']}', '${data['input-type']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/properties');
        }
    })
})

// Post route for adding a new agent
app.post('/add-agent-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let ytd_sales = parseFloat(data['input-ytd']);
    if (isNaN(ytd_sales))
    {
        ytd_sales = 0
    }
    query1 = `SELECT COUNT(*) FROM agents WHERE name = '${data['input-name']}'`;

    // Create the query and run it on the database
    query2 = `INSERT INTO agents (name, location, ytd_sale) VALUES ('${data['input-name']}', '${data['input-location']}', ${ytd_sales})`;

    db.pool.query(query1, function(error, rows, fields){

        let count = Object.values(JSON.parse(JSON.stringify(rows)))[0]['COUNT(*)'];
        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else if (count !== 0) 
        {
            res.redirect('/agents');
        }
        else 
        {
            db.pool.query(query2, function(error, rows, fields){

                // Check to see if there was an error
                if (error) {
        
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error)
                    res.sendStatus(400);
                }
                else
                {
                    res.redirect('/agents');
                }
            })
        }   
    })
})

// Post route for adding a new client type
app.post('/add-client-type-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;


    // Create the query and run it on the database
    query1 = `INSERT INTO client_types (description) VALUES ('${data['input-description']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/client-types');
        }
    })
})

// Post route for adding a new sale
app.post('/add-sale-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    // Capture NULL values
    let date = data['input-date'];

    // Capture NULL values
    let agent = parseInt(data['input-agent']);
    if (isNaN(agent))
    {
        agent = 'NULL'
    }

    if (date === '' || date.length === 0)
    {
        date = 'NULL'
        query1 = `INSERT INTO sales (price, agent_id, property_id) VALUES ('${data['input-price']}', ${agent}, '${data['input-property']}')`;
    }
    else
    {
        query1 = `INSERT INTO sales (sale_date, price, agent_id, property_id) VALUES ('${date}', '${data['input-price']}', ${agent}, '${data['input-property']}')`;
    }

    // Create the query and run it on the database
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/sales');
        }
    })
})

// Post route for adding a new client sale
app.post('/add-client-sale-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let date = data['input-date'];
    if (date === "")
    {
        date = 'NULL'
        query1 = `SELECT sale_id FROM sales WHERE sales.sale_date is NULL AND sales.property_id = '${data['input-property']}';`;
    } else 
    {
        query1 = `SELECT sale_id FROM sales WHERE sales.sale_date = '${data['input-date']}' AND sales.property_id = '${data['input-property']}';`;
    }


    // Create the query and run it on the database
    
    db.pool.query(query1, function(error, rows, fields){

        let count = Object.values(JSON.parse(JSON.stringify(rows)));

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else if (count.length === 0)
        {
            res.redirect('/client-sales');
        } 
        else 
        {   
            let sale = count[0].sale_id;
            dup_query_check = `SELECT COUNT(*) FROM client_sales WHERE client_id = '${data['input-client']}' AND sale_id = '${sale}'`;
            db.pool.query(dup_query_check, function(error, rows, fields){
                let count = Object.values(JSON.parse(JSON.stringify(rows)))[0]['COUNT(*)'];
                
                if (count !== 0)
                {
                    res.redirect('/client-sales');
                }
                else
                {
                    query2 = `INSERT INTO client_sales (sale_id, client_id) VALUES ('${sale}', '${data['input-client']}')`;
                    db.pool.query(query2, function(error, rows, fields){

                        if (error) {

                            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                            console.log(error)
                        }
                        else
                        {
                            res.redirect('/client-sales');
                        }

                    })
                }
            })
        }
    })
})

// Post route for adding a new property type
app.post('/add-property-type-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;


    // Create the query and run it on the database
    query1 = `INSERT INTO property_types (description) VALUES ('${data['input-description']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/property-types');
        }
    })
})

// Delete route for deleting a client from clients
app.delete('/delete-client-ajax/', function(req,res,next){
  let data = req.body;
  // clientID is the PK of the client to delete.
  let clientID = parseInt(data.id);
  let delete_clients = `DELETE FROM clients WHERE client_id = ?`;

        // Delete query
        db.pool.query(delete_clients, [clientID], function(error, rows, fields){
            if (error) {
                //log error
                console.log(error);
                res.sendStatus(400);
            }
            else
            {
                // send no content HTTP response
                res.sendStatus(204);
            }
})});

/// delete route for deleting a row from the intersection table agent_has_client_types
app.delete('/delete-agent-has-client-types-ajax/', function(req,res,next){
    let data = req.body;
    // agentHasClientTypesID is the PK of the row to delete from the intersection table agent_has_client_types
    let agentHasClientTypesID = parseInt(data.id);
    let delete_entry = `DELETE FROM agent_has_client_types WHERE id = ?`;
  
          // Run the delte query
          db.pool.query(delete_entry, [agentHasClientTypesID], function(error, rows, fields){
              if (error) {
                // Log the error if there is one
                console.log(error);
                res.sendStatus(400);
              }
              else
              {
                  //   Send no content successful HTTP response
                  res.sendStatus(204);
              }
  })});

// put route for updating a row in agent_has_client_types
app.put('/put-agent-has-client-types-ajax', function(req,res,next){
  let data = req.body;
  // id is the PK in the agent_has_client_types table to UPDATE
  let id = parseInt(data.id);
  // client_type is the new client_type_id to update for that PK
  let client_type = parseInt(data.client_type);

  let queryUpdateAgentHasClientType = `UPDATE agent_has_client_types SET client_type_id = ? WHERE id = ?`;
  // query to get only the row in agent_has_client_types that was updated. This row data will be sent to front end.
  let selectAgentHasClientType = `SELECT * FROM agent_has_client_types WHERE id = ?`

        // Run the update query to update the database
        db.pool.query(queryUpdateAgentHasClientType, [client_type, id], function(error, rows, fields){
            if (error) {
                console.log(error);
                res.sendStatus(400);
            }

            // If no error, run second query to update the agent_has_client_types table on the front-end
            else
            {
                db.pool.query(selectAgentHasClientType, [id], function(error, rows, fields){
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    }
                    else
                    {
                        // Send the query result to the front-end
                        res.send(rows);
                    }
                })
            }
})});

// put route for updating a row in clients
app.put('/put-client-ajax', function(req,res,next){
  let data = req.body;

  let agent = parseInt(data.agent);
  if (data.agent === "")
  {
    agent = 'NULL'
  }

  let client = parseInt(data.name);


  let queryUpdateAgent = `UPDATE clients SET agent_id = ${agent} WHERE clients.client_id = ?`;
  let selectAgent = `SELECT * FROM agents WHERE agent_id = ?`

        // Run the UPDATE query
        db.pool.query(queryUpdateAgent, [client], function(error, rows, fields){
            if (error) {
                // Log error and send 400 HTTP response
                console.log(error);
                res.sendStatus(400);
            }

            // If no error, get the updated data and return it to the front-end
            else
            {
                // Run the SELECT query to get the updated data
                db.pool.query(selectAgent, [agent], function(error, rows, fields) {

                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
})});

/*
    LISTENER
*/
// This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});

// Application framework based on the material here: https://github.com/osu-cs340-ecampus/nodejs-starter-app