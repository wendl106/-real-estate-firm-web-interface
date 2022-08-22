# real-estate-firm-web-interface
This is a webapp project designed to be accessed by the database manager of a real estate firm. The various pages on the webapp support thorough CRUD functionality while also clearly presenting the data.

# Web App UI and Functionality

## Page 1 (Clients): CREATE/READ and search 

<img width="1044" alt="Clients Main" src="https://user-images.githubusercontent.com/44763668/185907459-1b6e42b6-45ec-43d5-a727-4e3df2d79c6d.png">


The database client data is displayed (READ). A new client can be added (CREATE). Clients can also be searched by name.

## Page 1 (Clients): UPDATE and search 

<img width="907" alt="Clients Search and update" src="https://user-images.githubusercontent.com/44763668/185907477-bbe762c8-614e-4ec9-b1b5-6f746e3f9da4.png">

Agent name dropdown menu can be used to filter for clients associated with that agent (search). The agent associated with a client can also be updated (UPDATE). Note that the UPDATE allows for the agent to be set to NULL.

## Page 1 (Clients): DELETE

<img width="763" alt="Clients delete" src="https://user-images.githubusercontent.com/44763668/185907586-da5bf349-676e-4f82-a9c0-4f03261df29b.png">


Hovering over the displayed clients data gives the option to delete that client (DELETE).

## Page 2 (Agents): CREATE/READ

<img width="1038" alt="Agents Main" src="https://user-images.githubusercontent.com/44763668/185907690-8df0231f-161f-41e7-9376-62837b781980.png">


The database agent data is displayed (READ). A new agent can be added (CREATE).


## Page 3 (Agent Has Client Types): CREATE/READ/UPDATE

<img width="1086" alt="Agent has client types main" src="https://user-images.githubusercontent.com/44763668/185907787-fa556bcf-667b-42a9-a497-bd738ea3ce1e.png">


The database agent_has_client_types intersection table data is displayed (READ). A new agent_has_client_types FK pairing can be added (CREATE). The agent_id FK associated with an entry in the intersection table can be updated (UPDATE).

## Page 3 (Agent Has Client Types): DELETE

<img width="675" alt="Agent has client types delete" src="https://user-images.githubusercontent.com/44763668/185907839-1e26e967-33d0-4405-a847-96c8edb1b751.png">


Hovering over the displayed row in the intersection table gives the option to delete that entry (DELETE).

## Page 4 (Client Types): CREATE/READ

<img width="1041" alt="Client types main" src="https://user-images.githubusercontent.com/44763668/185907863-573d4f35-3325-4f30-a70f-115ab40b8c65.png">


The database client_type data is displayed (READ). A new client_type can be added (CREATE).

## Page 5 (Sales): CREATE/READ

<img width="1048" alt="Sales main" src="https://user-images.githubusercontent.com/44763668/185907908-c710f263-7ab8-490b-ad68-544c87ca64f6.png">


The database sales data is displayed (READ). A new sale can be added (CREATE).

## Page 6 (Client Sales): CREATE/READ

<img width="1224" alt="Client sales main" src="https://user-images.githubusercontent.com/44763668/185907932-caeaedfd-f281-436e-a508-a809c205b5be.png">


The database client_sales data is displayed (READ). A new client_sale can be added (CREATE).

## Page 7 (Properties): CREATE/READ

<img width="1076" alt="Properties main" src="https://user-images.githubusercontent.com/44763668/185907960-8b994547-992a-49f0-954b-f13e526242f0.png">


The database properties data is displayed (READ). A new property can be added (CREATE).

## Page 8 (Property Types): CREATE/READ

<img width="1042" alt="Property types main" src="https://user-images.githubusercontent.com/44763668/185908000-8ff35553-c09d-47f6-bbc4-7bb4b98a1547.png">


The database property_types data is displayed (READ). A new property type can be added (CREATE).

# Entity Relationship (ER) Diagram for the Database

![ER Diagram](https://user-images.githubusercontent.com/44763668/185908674-007d167b-9c3c-4b62-a882-72c24d6cefa7.png)

