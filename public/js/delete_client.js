function deleteClient(clientID) {
    let link = '/delete-client-ajax/';
    let data = {
      id: clientID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(clientID);
        window.location.reload();
      }
    });
  }
  
function deleteRow(clientID){
    let table = document.getElementById("client-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == clientID) {
            table.deleteRow(i);
            break;
        }
    }
  }