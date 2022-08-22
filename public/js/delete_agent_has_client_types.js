function deleteAgentHasClient(ID) {
    let link = '/delete-agent-has-client-types-ajax/';
    let data = {
      id: ID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(ID);
        window.location.reload();
      }
    });
  }
  
function deleteRow(ID){
    let table = document.getElementById("agent-has-client-types-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == ID) {
            table.deleteRow(i);
            break;
        }
    }
  }