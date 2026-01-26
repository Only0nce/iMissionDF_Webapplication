var currentID = -1;
var wsUri;
var ws;
var currentSoftPhoneID = 1;
var userID = 0;
WebSocketTest();
function WebSocketTest() {

  if ("WebSocket" in window) {
     // Let us open a web socket
     wsUri = "ws://" + location.host + ":8081";
     ws = new WebSocket(wsUri);

     ws.onopen = function() {
      ws.send('{"menuID":"getDevicesPage"}');
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
function setUserID(id)
{
  userID = id;
  console.log("setUserID",userID)
}
function processMsg(message){

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
  var serialnumber = document.getElementById("serialnumber"+currentID).value;
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
                  '"userID"   :'+userID+' ,' +
                  '"currentID":'+currentID+' ,' +
                  '"name"     :"'+name+'" ,'+
                  '"username" :"'+username+'" ,' +
                  '"password" :"'+password+'" ,'+
                  '"serialnumber" :"'+serialnumber+'" ,'+
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

function deleteDevice()
{  
  if (currentID == -1) return;

  else
  {
    let text =  '{ "menuID"   : "deleteDevice", ' +
                  '"currentID":'+currentID+'}';
    console.log("deleteDevice",text)
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

function insertClientInRole()
{  
  currentID = 0;
  var name = document.getElementById("devicename"+currentID).value;
  var username = document.getElementById("username"+currentID).value;
  var password = document.getElementById("password"+currentID).value;
  var serialnumber = document.getElementById("serialnumber"+currentID).value;
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
                  '"userID"   :'+userID+' ,' +
                  '"currentID":'+currentID+' ,' +
                  '"name"     :"'+name+'" ,'+
                  '"username" :"'+username+'" ,' +
                  '"password" :"'+password+'" ,'+
                  '"serialnumber" :"'+serialnumber+'" ,'+
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
  let name = "confirmToDeleteClient";
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
function showOnly1ID(id,description,pathImage,array)
{
  console.log(array.length);
  document.getElementById("deviceIdSelectLabel").innerHTML = description;
  document.getElementById("deviceIdSelectSVG").setAttribute('xlink:href', "dashboard.svg#"+pathImage);
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