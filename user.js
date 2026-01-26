var currentID = -1;
var wsUri;
var ws;
var currentSoftPhoneID = 1;
var waitForCreateUser = false;
var waitForDeleteUser = false;
var waitForEditUser = false;
WebSocketTest();
function WebSocketTest() {

  if ("WebSocket" in window) {
     // Let us open a web socket
     wsUri = "ws://" + location.host + ":8009";
     ws = new WebSocket(wsUri);

     ws.onopen = function() {
      ws.send('{"menuID":"getUserPage"}');
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
function processMsg(message){
  // console.log(message);
  var obj = JSON.parse(message);
  if (obj.menuID == "oncreateUser")
  {
    console.log(message);
    if (obj.completed == "true")
    {
      if (waitForCreateUser)
      {
        ModalUserAlert("Create New User Completed");
        setTimeout(() => {location.reload();}, 3000);
      }
    }
    else
    {
      if (waitForCreateUser)
      {
        ModalUserAlert("Error: Unable to create new user account");
        waitForCreateUser = false;
      }
    }
  }
  else if (obj.menuID == "onchangePassword")
  {
    console.log(message);
    if (obj.completed == "true")
    {
      if (waitForEditUser)
      {
        ModalUserAlert("Edit User Completed");
        setTimeout(() => {location.reload();}, 3000);
      }
    }
    else
    {
      if (waitForEditUser)
      {
        ModalUserAlert("Error: Unable to edit user account");
        waitForEditUser = false;
      }
    }
  }
  else if (obj.menuID == "onDeleteUser")
  {
    console.log(message);
    if (obj.completed == "true")
    {
      if (waitForDeleteUser)
      {
        ModalUserAlert("Delete User Completed");
        setTimeout(() => {location.reload();}, 3000);
      }
    }
    else
    {
      if (waitForDeleteUser)
      {
        ModalUserAlert("Error: Unable to delete user account");
        waitForDeleteUser = false;
      }
    }
  }
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
function ModalUserAlert(text)
{
    document.getElementById("textAlert").innerHTML = text;
    let name = "ModalUserAlert";
    let modal = null;

    if (!modal) {
      var modalElement = document.getElementById(name);
      modal = new bootstrap.Modal(modalElement);
    }
    modal.show();
}

function setDeviceIOPort(deviceID, ioPort)
{
  var ioPortLabelElement = document.getElementById("ioPortLabel"+deviceID);
  ioPortLabelElement.innerHTML = "IO Port: "+ioPort;
  var ioPortLabelElement = document.getElementById("ioPortValue"+deviceID).value = ioPort;
}

function setDeviceTemplate(deviceID,templateID,pathImage,description)
{
  console.log(deviceID,templateID,pathImage,description)
  var ElementDeviceTemplateId = document.getElementById("deviceTemplate"+deviceID);
  var ElementdeviceTemplateSVG = document.getElementById("deviceTemplateSVG"+deviceID);
  var ElementdeviceIconSVG = document.getElementById("icon"+deviceID);
  var ElementdeviceTemplateLabel = document.getElementById("deviceTemplateLabel"+deviceID);
  ElementDeviceTemplateId.value = templateID;
  ElementdeviceTemplateSVG.setAttribute('xlink:href', "dashboard.svg#"+pathImage);
  ElementdeviceIconSVG.setAttribute('xlink:href', "dashboard.svg#"+pathImage);
  ElementdeviceTemplateLabel.innerHTML = description;

  var ioPortElement = document.getElementById("ioPort"+deviceID)
  if ((templateID == 5) || (templateID == 6) || (templateID == 7))
    ioPortElement.style.display = "block";  
  else 
    ioPortElement.style.display = "none";
}

function editDevice()
{  
  if (currentID == -1) return;

  var name = document.getElementById("devicename"+currentID).value;
  var username = document.getElementById("username"+currentID).value;
  var password = document.getElementById("password"+currentID).value;
  var deviceTemplateID = document.getElementById("deviceTemplate"+currentID).value;
  var ipaddress = document.getElementById("ipaddress"+currentID).value;
  var ioPortValue =  document.getElementById("ioPortValue"+currentID).value;
  // document.getElementById("DeviceName"+currentID).value = name;
  console.log("editDevice", currentID,name,username,password,deviceTemplateID,ipaddress);
  if (username == "") document.getElementById("username"+currentID).focus() = true;
  else if (password == "") document.getElementById("password"+currentID).focus() = true;  
  else if (name == "") document.getElementById("devicename"+currentID).focus() = true;
  else if (ipaddress == "") document.getElementById("ipaddress"+currentID).focus() = true;
  else if (deviceTemplateID == 0) document.getElementById('deviceTemplate'+currentID).style = "--bs-btn-border-color:red; width:100%";
  else
  {
    let text =  '{ "menuID"   : "editDevice", ' +
                  '"currentID":'+currentID+' ,' +
                  '"name"     :"'+name+'" ,'+
                  '"username" :"'+username+'" ,' +
                  '"password" :"'+password+'" ,'+
                  '"deviceTemplateID":'+deviceTemplateID+' ,' +
                  '"ioPortValue":'+ioPortValue+' ,' +
                  '"ipaddress" :"'+ipaddress+'" }';
    console.log("editDevice",text)
    const jsonMessage = JSON.parse(text);                
    currentID = -1;

    if (ws.readyState == 1)
    {
      ws.send(text);
      setTimeout(() => {location.reload();}, 1000);
    }
    else
    {
      alertConnection();
      location.reload();
    }
  }
}

function deleteUser()
{  
  if (currentID == -1) return;

  else
  {
    let text =  '{ "menuID"   : "deleteUser", ' +
                  '"userID":'+currentID+'}';
    console.log("deleteUser",text)
    const jsonMessage = JSON.parse(text);                
    currentID = -1;

    if (ws.readyState == 1)
    {
      ws.send(text);
      waitForDeleteUser = true;
    }
    else
    {
      alertConnection();
      location.reload();
    }
  }
}

function insertClientInRole()
{  
  currentID = 0;
  var name = document.getElementById("devicename"+currentID).value;
  var username = document.getElementById("username"+currentID).value;
  var password = document.getElementById("password"+currentID).value;
  var deviceTemplateID = document.getElementById("deviceTemplate"+currentID).value;
  var ipaddress = document.getElementById("ipaddress"+currentID).value;
  var ioPortValue =  document.getElementById("ioPortValue"+currentID).value;
  // document.getElementById("DeviceName"+currentID).value = name;
  console.log("insertClientInDatabase", currentID,name,username,password,deviceTemplateID,ipaddress);
  
  if (username == "") document.getElementById("username"+currentID).focus() = true;
  else if (password == "") document.getElementById("password"+currentID).focus() = true;  
  else if (name == "") document.getElementById("devicename"+currentID).focus() = true;
  else if (ipaddress == "") document.getElementById("ipaddress"+currentID).focus() = true;
  else if (deviceTemplateID == 0) document.getElementById('deviceTemplate'+currentID).style = "--bs-btn-border-color:red; width:100%";
  else
  {
    let text =  '{ "menuID"   : "insertClientInDatabase", ' +
                  '"currentID":'+currentID+' ,' +
                  '"name"     :"'+name+'" ,'+
                  '"username" :"'+username+'" ,' +
                  '"password" :"'+password+'" ,'+
                  '"deviceTemplateID":'+deviceTemplateID+' ,' +
                  '"ioPortValue":'+ioPortValue+' ,' +
                  '"ipaddress" :"'+ipaddress+'" }';
    console.log("insertClientInDatabase",text)
    const jsonMessage = JSON.parse(text);                
    currentID = -1;

    if (ws.readyState == 1)
    {
      ws.send(text);
      setTimeout(() => {location.reload();}, 1000);
    }
    else
    {
      alertConnection();
      location.reload();
    }
  }
}
function setCurrentIdForDelete(id)
{
  currentID = id;
  let name = "confirmToDeleteUser";
  let modal = null;

  if (!modal) {
    var modalElement = document.getElementById(name);
    modal = new bootstrap.Modal(modalElement);
  }
  modal.show();
}

function setCurrentId(id)
{
  currentID = id;
  var name = document.getElementById("devicename"+currentID).value;
  var username = document.getElementById("username"+currentID).value;
  var password = document.getElementById("password"+currentID).value;
  var deviceTemplateID = document.getElementById("deviceTemplate"+currentID).value;
  var ipaddress = document.getElementById("ipaddress"+currentID).value;
  var ioPortValue =  document.getElementById("ioPortValue"+currentID).value;
  if (username == "") document.getElementById("username"+currentID).focus() = true;
  else if (password == "") document.getElementById("password"+currentID).focus() = true;  
  else if (name == "") document.getElementById("devicename"+currentID).focus() = true;
  else if (ipaddress == "") document.getElementById("ipaddress"+currentID).focus() = true;
  else if (deviceTemplateID == 0) document.getElementById('deviceTemplate'+currentID).style = "--bs-btn-border-color:red; width:100%";
  else{
    let name = "confirmToEditClient";
    let modal = null;

    if (!modal) {
      var modalElement = document.getElementById(name);
      modal = new bootstrap.Modal(modalElement);
    }
    modal.show();
  }
}

function resetCurrentId()
{
  currentID = -1;
}
function myFunction(item, index, arr) {
  console.log(item)
}
function showOnly1User(id,description,pathImage,array)
{
  console.log(array.length);
  document.getElementById("userIdSelectLabel").innerHTML = description;
  document.getElementById("userIdSelectSVG").setAttribute('xlink:href', "fontawesome-free-5.15.4-web/sprites/solid.svg#"+pathImage);
  if (id==0)
  {
    for (i=0; i<array.length; i++) 
    {
      let containerId = "container"+array[i].id;
      console.log(array[i].id);
      document.getElementById(containerId).style.display = "block";
    }
  }
  else
  {
    for (i=0; i<array.length; i++) 
    {
      let containerId = "container"+array[i].id;
      console.log(array[i].id);
      document.getElementById(containerId).style.display = "none";
    }
    containerId = "container"+id;
    document.getElementById(containerId).style.display = "block";
  }
  
}

function setNewUserLevel(userID, userlevel, elementname, pathImage)
{
  document.getElementById(elementname+"Label").innerHTML = userlevel;
  document.getElementById(elementname+"SVG").setAttribute('xlink:href','fontawesome-free-5.15.4-web/sprites/solid.svg#' + pathImage);
  document.getElementById(elementname).value = userlevel == "Administrator" ? 1 : 2;
  document.getElementById("userlevel0").style = "--bs-btn-border-color:var(--bs-border-color); width:100%"
}

function applyNewUser(){  
  var username = document.getElementById("username0").value;
  var newpassword = document.getElementById("newpassword0").value;
  var cfpassword = document.getElementById("cfpassword0").value;
  var userlevel = document.getElementById("userlevel0").value;
  if (username == "") 
  {
    document.getElementById("username0").focus() = true;
  }
  else if (newpassword == ""){
    document.getElementById("newpassword0").focus() = true;
  }
  else if (newpassword != cfpassword)
  {
    document.getElementById("cfpassword0").focus() = true;
  }
  else if (userlevel == "")
  {
    document.getElementById("userlevel0").style = "--bs-btn-border-color:red; width:100%"
  }
  else
  {
    let text =  '{ "menuID"   : "insertNewUserInDatabase", ' +
                  '"username":"'+username+'" ,' +
                  '"password" :"'+newpassword+'" ,'+
                  '"userlevel" :'+userlevel+'}';
    console.log("insertNewUserInDatabase",text)

    const jsonMessage = JSON.parse(text);                
    currentID = -1;

    if (ws.readyState == 1)
    {
      ws.send(text);
      waitForCreateUser = true;
      dismissModal("ModalNewUser");      
    }
    else
    {
      alertConnection();
      location.reload();
    }
  }

}
function dismissModal(modalName)
{
  var myModalEl = document.getElementById(modalName);
  var modal = bootstrap.Modal.getInstance(myModalEl)
  modal.hide();
}

function applyEditUser(userID){  
  var username = document.getElementById("username"+userID).value;
  var newpassword = "";
  var cfpassword = "";
  var userlevel = document.getElementById("userlevel"+userID).value;

  if (document.getElementById("newpassword"+userID))
    newpassword = document.getElementById("newpassword"+userID).value;

  if (document.getElementById("cfpassword"+userID))
    cfpassword = document.getElementById("cfpassword"+userID).value;


  let text =  '{ "menuID"   : "applyEditUser", ' +
                  '"username":"'+username+'" ,' +
                  '"password" :"'+newpassword+'" ,'+
                  '"cfpassword" :"'+cfpassword+'" ,'+
                  '"userlevel" :'+userlevel+'}';
  

  if (username == "") 
  {
    document.getElementById("username"+userID).focus() = true;
    return;
  }
  else if ((newpassword == "") & (cfpassword == ""))
  {
    
  }
  else if (newpassword == "")
  {
    document.getElementById("newpassword"+userID).focus() = true;
    console.log("(newpassword == '')",text)
    return;
  }
  else if (newpassword != cfpassword)
  {
    document.getElementById("cfpassword"+userID).focus() = true;
    console.log("(newpassword != cfpassword)",text)
    return;
  }
  else if (userlevel == "")
  {
    document.getElementById("userlevel"+userID).style = "--bs-btn-border-color:red; width:100%"
    console.log("(userlevel == '')",text)
    return;
  }
  // else
    // let text =  '{ "menuID"   : "applyEditUser", ' +
    //               '"username":"'+username+'" ,' +
    //               '"password" :"'+newpassword+'" ,'+
    //               '"userlevel" :'+userlevel+'}';
  console.log("applyEditUser",text)

  const jsonMessage = JSON.parse(text);                
  currentID = -1;

  if (ws.readyState == 1)
  {
    ws.send(text);
    waitForEditUser = true;
  }
  else
  {
    alertConnection();
    location.reload();
  }

}