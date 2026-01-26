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
     wsUri = "ws://" + location.host + ":8081";
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

function locationreloadDevice(roleID, deviceDescription, method='post') {
  const form = document.createElement('form');
  form.method = method;

  const hiddenField = document.createElement('input');
  hiddenField.type = 'hidden';
  hiddenField.name = "roleID";
  hiddenField.value = roleID;

  form.appendChild(hiddenField);

  if(deviceDescription != ""){
    const deviceName = document.createElement('input');
    deviceName.type = 'hidden';
    deviceName.name = "deviceName";
    deviceName.value = deviceDescription;
    form.appendChild(deviceName);
  }

  console.log(roleID,deviceDescription)

  document.body.appendChild(form);
  form.action = "index.php";
  form.submit();
}

function ChangeActiveRoleID()
{
  var roleID = document.getElementById('buttonChangeID').value;
  if (roleID <= 0) return;

  else
  {
    let text =  '{ "menuID"   : "ChangeActiveRoleID", ' +
                  '"roleID":'+roleID+'}';
    console.log("ChangeActiveRoleID",text)
    const jsonMessage = JSON.parse(text);                
    currentID = -1;

    if (ws.readyState == 1)
    {
      ws.send(text);
      setTimeout(() => {locationreload(currentRoleID);}, 1000);
    }
    else
    {
      alertConnection();
      location.reload();
    }
  }
}
function selectActiveRoleID(id,roleName)
{
    document.getElementById("roleIdSelectLabel").innerHTML = roleName;
}
function setCurrentRoleId(roleID, roleName)
{
  console.log("setCurrentRoleId",roleID,roleName);
  currentRoleID = roleID;
  currentRoleName = roleName;
  document.getElementById('roleIdSelected').value = currentRoleID;
  document.getElementById('roleNameToNewDevice').value = currentRoleName;

  if (currentRoleID <= 0)
    {
        // setCurrentRoleId(obj.roleID, obj.roleName);
        // selectActiveRoleID(obj.roleID, obj.roleName);
        // setTimeout(() => {locationreload(obj.roleID);}, 100);
    }else {
      document.getElementById('roleIdSelect'+roleID).className +=" active";
      document.getElementById('roleIdSelectLink'+roleID).className +=" active";
      document.getElementById('roleIdSelect').value = roleID;
    }
}
function selectRoleID(id,roleName,array)
{
    // for (i=0; i<array.length; i++) 
    // {
    //   let containerId = "roleDiv"+array[i].roleID;
    //   document.getElementById(containerId).style.display = "none";
    // }
    // containerId = "roleDiv"+id;
    // document.getElementById(containerId).style.display = "block";

    // document.getElementById("roleIdSelectLabel").innerHTML = roleName;
    
    locationreload(id);
}

function alertDeleteRoleID()
{
    let name = "confirmToDeleteRoleID";
    let modal = null;

    if (!modal) {
      var modalElement = document.getElementById(name);
      modal = new bootstrap.Modal(modalElement);
    }
    modal.show();
}

function alertConnection()
{
    let name = "ModalAlert";
    let modal = null;

    if (!modal) {
      var modalElement = document.getElementById(name);
      modal = new bootstrap.Modal(modalElement);
    }
    modal.show();
}

function changeDevice(roleIndex, currentID, changed2Id, changed2Name, newiconName,ipaddress)
{
  ApplyButton = "ApplyButton"+roleIndex;
  if (currentID == changed2Id) 
  {
    document.getElementById(ApplyButton).style.display = "none";    
  }
  else
  {    
    document.getElementById(ApplyButton).style.display = "block";    
  }
    document.getElementById("DeviceName"+roleIndex).innerHTML = changed2Name;
    document.getElementById("ipaddress"+roleIndex).value = ipaddress;
    document.getElementById("deviceIdSelect"+roleIndex).value = changed2Id;
    document.getElementById("deviceIdSelectLabel"+roleIndex).innerHTML = changed2Name;
    document.getElementById("deviceIdSelectSVG"+roleIndex).setAttribute('xlink:href', "dashboard.svg#"+newiconName);
    document.getElementById("icon"+roleIndex).setAttribute('xlink:href', "dashboard.svg#"+newiconName);
}
function resetCurrentId()
{  
  roleIndexForApplyChange = -1;
  currentRoleIDForApplyChange = -1;
  setTimeout(() => {location.reload();}, 1000);
}
function setCurrentRoleIdForApplyChange(roleIndex, currentRoleID)
{
  roleIndexForApplyChange = roleIndex;
  currentRoleIDForApplyChange = currentRoleID;

  {
    let name = "confirmToEditClientInRole";
    let modal = null;

    if (!modal) {
      var modalElement = document.getElementById(name);
      modal = new bootstrap.Modal(modalElement);
    }
    modal.show();
  }
}

function deleteDevice()
{  
  var currentID = roleIndexForApplyChange;
  var currentRoleID = currentRoleIDForApplyChange;
  if (currentID == -1) return;

  else
  {
    let text =  '{ "menuID"   : "deleteDeviceIdInRole", ' +
                  '"currentID":'+currentID+'}';
    console.log("deleteDevice",text)
    const jsonMessage = JSON.parse(text);                
    currentID = -1;

    if (ws.readyState == 1)
    {
      ws.send(text);
      setTimeout(() => {locationreload(currentRoleID);}, 1000);
    }
    else
    {
      alertConnection();
      location.reload();
    }
  }
}

function setRoleIdForDelete(roleIndex,currentRoleID)
{
  roleIndexForApplyChange = roleIndex;
  currentRoleIDForApplyChange = currentRoleID;
  let name = "confirmToDeleteClient";
  let modal = null;

  if (!modal) {
    var modalElement = document.getElementById(name);
    modal = new bootstrap.Modal(modalElement);
  }
  modal.show();
}

function applyChange()
{
  var roleIndex = roleIndexForApplyChange;
  var currentRoleID = currentRoleIDForApplyChange;
  let ApplyButton = "ApplyButton"+roleIndex;
  var changed2Id = document.getElementById("deviceIdSelect"+roleIndex).value;
  let text =  '{ "menuID"     : "changeDeviceInRole", ' +
                '"roleIndex"  :'+roleIndex+' ,' +
                '"changed2Id" :'+changed2Id+'}';

  console.log("changeDeviceInRole",text,roleIndex,changed2Id)
  const jsonMessage = JSON.parse(text);                

  if (ws.readyState == 1)
  {
    ws.send(text);
    document.getElementById(ApplyButton).style.display = "none";    
    setTimeout(() => {locationreload(currentRoleID);}, 1000);
  }
  else
  {
    alertConnection();
    location.reload();
  }
}


function locationreload(roleID, method='post') {
  const form = document.createElement('form');
  form.method = method;

  const hiddenField = document.createElement('input');
  hiddenField.type = 'hidden';
  hiddenField.name = "roleID";
  hiddenField.value = roleID;

  form.appendChild(hiddenField);

  document.body.appendChild(form);
  form.submit();
}


function setRoleIdToNewDevice(roleIndex,roleName,array)
{
  document.getElementById('roleIdSelected').value = roleIndex;
  document.getElementById('roleIdSelectedLabel').innerHTML = roleName;
  document.getElementById('roleNameToNewDevice').value  = roleName;
  if (roleIndex == 0){
    document.getElementById("roleIdSelectedSVG").setAttribute('xlink:href', "fontawesome-free-5.15.4-web/sprites/solid.svg#plus-circle");
    document.getElementById('roleNameToNewDevice').value = "";
    document.getElementById('roleNameToNewDevice').focus();
  }
  else
    document.getElementById("roleIdSelectedSVG").setAttribute('xlink:href', "fontawesome-free-5.15.4-web/sprites/solid.svg#layer-group");
}

function setNewDeviceToRole(deviceIndex,deviceName,iconName,array)
{
  document.getElementById('newDeviceIdSelect').value = deviceIndex;
  document.getElementById('newDeviceIdSelectLabel').innerHTML = deviceName;
  document.getElementById("newDeviceIdSelectSVG").setAttribute('xlink:href', "dashboard.svg#"+iconName);
  document.getElementById("iconNewDevice").setAttribute('xlink:href', "dashboard.svg#"+iconName);
}

function deleteRoleID() 
{
  var roleID = document.getElementById('roleIdSelected').value;
  var roleName = document.getElementById('roleNameToNewDevice').value;
  var deviceID = document.getElementById('newDeviceIdSelect').value;

  let text =  '{ "menuID"   : "deleteRoleID", ' +
                '"roleID":'+roleID+' ,' +
                '"roleName"     :"'+roleName+'" }';
  console.log("changeRoleName",text)
  const jsonMessage = JSON.parse(text);                
  currentID = -1;

  if (ws.readyState == 1)
  {
    ws.send(text);
    resetInsertNewDeviceInRole();
    setTimeout(() => {location.reload();}, 1000);
  }
  else
  {
    alertConnection();
    location.reload();
  }  
}

function applyInsertNewDeviceInRole(userID)
{
  var roleID = document.getElementById('roleIdSelected').value;
  var roleName = document.getElementById('roleNameToNewDevice').value;
  var deviceID = document.getElementById('newDeviceIdSelect').value;
  if (deviceID == -1) 
  {
    if  (roleID <= 0)
    {
      document.getElementById('roleIdSelected').attributes['aria-expanded'].value = true;
      document.getElementById('dropdownRoleIdSelected').className +=" show";
      document.getElementById('roleIdSelected').className +=" show";
    }
    else
    {
      alertDeleteRoleID();   
    }

  }
  else if ((deviceID == 0) & (roleID > 0)) 
  {
    let text =  '{ "menuID"   : "changeRoleName", ' +
                  '"roleID":'+roleID+' ,' +
                  '"roleName"     :"'+roleName+'" }';
    console.log("changeRoleName",text)
    const jsonMessage = JSON.parse(text);                
    currentID = -1;

    if (ws.readyState == 1)
    {
      ws.send(text);
      resetInsertNewDeviceInRole();
      setTimeout(() => {location.reload();}, 1000);
    }
    else
    {
      alertConnection();
      location.reload();
    }
  }
  else if (roleName == "")
  {
    document.getElementById('roleNameToNewDevice').focus();
  }
  else
  {
    let text =  '{ "menuID"   : "insertNewDeviceInRole", ' +
                  '"roleID":'+roleID+' ,' +
                  '"userID":'+userID+' ,' +
                  '"roleName"     :"'+roleName+'" ,'+
                  '"deviceID" :'+deviceID+' }';
    console.log("insertNewDeviceInRole",text)
    const jsonMessage = JSON.parse(text);                
    currentID = -1;

    if (ws.readyState == 1)
    {
      ws.send(text);
      resetInsertNewDeviceInRole();
      setTimeout(() => {location.reload();}, 1000);
    }
    else
    {
      alertConnection();
      location.reload();
    }
  }
}

function resetInsertNewDeviceInRole()
{
  document.getElementById('roleIdSelected').value = currentRoleID;
  document.getElementById('roleNameToNewDevice').value = currentRoleName;
  document.getElementById('newDeviceIdSelect').value = 0;
  document.getElementById("newDeviceIdSelectSVG").setAttribute('xlink:href', "dashboard.svg#puzzle");
  document.getElementById("iconNewDevice").setAttribute('xlink:href', "dashboard.svg#puzzle");
  document.getElementById('newDeviceIdSelectLabel').innerHTML = "Please Select Device";
}