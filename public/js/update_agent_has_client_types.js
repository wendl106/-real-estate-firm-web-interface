// Get the objects we need to modify
let updateAgentHasClientForm = document.getElementById('update-agent-has-client-types-form-ajax');

// Modify the objects we need
updateAgentHasClientForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputID = document.getElementById("mySelect");
    let inputClientType = document.getElementById("input-client-type-update");

    // Get the values from the form fields
    let IDValue = inputID.value;
    let clientTypeValue = inputClientType.value;
    
    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld

    if (isNaN(clientTypeValue)) 
    {
        return;
    }


    // Put our data we want to send in a javascript object
    let data = {
        id: IDValue,
        client_type: clientTypeValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-agent-has-client-types-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, IDValue);
            window.location.reload();

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, IDValue){
    let parsedData = JSON.parse(data);
    let table = document.getElementById("agent-has-client-types-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == IDValue) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of client type data
            let td = updateRowIndex.getElementsByTagName("td")[2];

            // Reassign client type
            td.innerHTML = parsedData[0].client_type;
       }
    }
}