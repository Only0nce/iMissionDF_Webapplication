var currentID = -1;
var wsUri;
var ws;
var currentRoleID = 0;
var currentRoleName = "";
var roleIndexForApplyChange = -1;
var currentRoleIDForApplyChange = -1;
WebSocketTest();
function WebSocketTest() {

  if ("WebSocket" in window) {
     // Let us open a web socket
     wsUri = "ws://" + location.host + ":8000";
     ws = new WebSocket(wsUri);

     ws.onopen = function() {
      setTimeout(() => {ws.send('{"menuID":"getRolesPage"}');}, 100);
     };

     ws.onmessage = function (evt) { 
      var received_msg = evt.data;
      processMsg(received_msg);
     };

     ws.onclose = function() { 
      // websocket is closed.
      
      alertConnection(); 
      
     };
  } else {

     // The browser doesn't support WebSocket
     alert("WebSocket NOT supported by your Browser!");
  }
}
function processMsg(message)
{
  // console.log(message);
  var obj = JSON.parse(message);
  if (obj.menuID == "currentRoleIdActive")
  {


  }

}
