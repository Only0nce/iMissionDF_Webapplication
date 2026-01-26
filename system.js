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
      ws.send('{"menuID":"getSystemPage"}');
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
  
  var obj = JSON.parse(message);
  if(obj.menuID == "broadcastLocalTime")
  {
    document.getElementById("currentTime").innerHTML = obj.currentTime;
    document.getElementById("currentDate").innerHTML = obj.currentDate;
  }
  else if(obj.menuID == "system")
  {
    let ntpserver = obj.ntpServer;
    const ntpserverArray = ntpserver.split(" ", 4);
    if (document.getElementById("swversion"))
      document.getElementById("swversion").value = obj.SwVersion;
    if (document.getElementById("dateTimeMethod"))
      document.getElementById("dateTimeMethod").value = obj.dateTimeMethod;   
    if (document.getElementById("LocationList"))
      document.getElementById("LocationList").value = obj.location;
    if(ntpserverArray[0])
      document.getElementById("ntpserver1").value = ntpserverArray[0];
    if(ntpserverArray[1])
      document.getElementById("ntpserver2").value = ntpserverArray[1];
    if(ntpserverArray[2])
      document.getElementById("ntpserver3").value = ntpserverArray[2];
    if(ntpserverArray[3])
      document.getElementById("ntpserver4").value = ntpserverArray[3];
    datetimeMethod();
  }
  else if(obj.menuID == "network")
  {
    console.log(message);
    var ethIndex  = obj.ethIndex; 
    document.getElementById("divEth"+ethIndex).style.display = "block";
    phyNetworkName = obj.phyNetworkName;
    console.log(message,obj.phyNetworkName)
    phyNetworkNameEl = document.getElementById("DeviceName"+ethIndex);
    dhcpmethodEl = document.getElementById("dhcpmethod"+ethIndex);
    dhcpmethodLabel = document.getElementById("dhcpmethodLabel"+ethIndex);
    ipaddressEl = document.getElementById("ipaddress"+ethIndex)
    netmaskEl = document.getElementById("netmask"+ethIndex)
    gatewayEl = document.getElementById("gateway"+ethIndex)
    dns1El = document.getElementById("dns1"+ethIndex)
    dns2El = document.getElementById("dns2"+ethIndex)
    macaddressEl = document.getElementById("macaddress"+ethIndex)
    phyNetworkNameEl.innerHTML = phyNetworkName;
    dhcpmethod = obj.dhcpmethod;
    ipaddress = obj.ipaddress;
    subnet = obj.subnet;
    gateway = obj.gateway;
    pridns = obj.pridns;
    secdns = obj.secdns;
    macaddress = obj.macAddress;

    if(obj.ethUp == 0)
      document.getElementById('ethernet'+obj.ethIndex).style.fill ="var(--bs-danger)";
    else
      document.getElementById('ethernet'+obj.ethIndex).style.fill ="var(--bs-link)";

    if (dhcpmethodEl){
      dhcpmethodEl.value = dhcpmethod;
      dhcpmethodLabel.innerHTML = dhcpmethod == 'on' ? "Automatic" : "Static"
    }
    if (ipaddressEl)
      ipaddressEl.value = ipaddress;
    if (netmaskEl)
      netmaskEl.value = subnet;
    if (gatewayEl)
      gatewayEl.value = gateway;
    if (dns1El)
      dns1El.value = pridns;
    if (dns2El)
      dns2El.value = secdns;
    if (macaddressEl)
      macaddressEl.value = macaddress;


    if (dhcpmethod == 'on')
    {
      ipaddressEl.disabled = true;
      netmaskEl.disabled = true;
      gatewayEl.disabled = true;
      dns1El.disabled = true;
      dns2El.disabled = true;
    }
    else
    {
      ipaddressEl.disabled = false;
      netmaskEl.disabled = false;
      gatewayEl.disabled = false;
      dns1El.disabled = false;
      dns2El.disabled = false;
    }
  }
}
function applyNetwork(ethIndex)
{
  phyNetworkNameEl = document.getElementById("DeviceName"+ethIndex);
  dhcpmethodEl = document.getElementById("dhcpmethod"+ethIndex);
  dhcpmethodLabel = document.getElementById("dhcpmethodLabel"+ethIndex);
  ipaddressEl = document.getElementById("ipaddress"+ethIndex)
  netmaskEl = document.getElementById("netmask"+ethIndex)
  gatewayEl = document.getElementById("gateway"+ethIndex)
  dns1El = document.getElementById("dns1"+ethIndex)
  dns2El = document.getElementById("dns2"+ethIndex)

  phyNetworkName = phyNetworkNameEl.innerHTML;
  dhcpmethod = dhcpmethodEl.value;
  ipaddress = ipaddressEl.value;
  subnet = netmaskEl.value;
  gateway = gatewayEl.value;
  pridns = dns1El.value;
  secdns = dns2El.value;

  var jsonMessage = "";


  if (ws.readyState == 1)
  {
    jsonMessage = '{"menuID":"updateLocalNetwork", "dhcpmethod":"' + dhcpmethod + '", "ipaddress":"' + ipaddress + '", "subnet":"' + subnet + '", "gateway":"' + gateway + '", "pridns":"' + pridns + '", "secdns":"' + secdns + '", "phyNetworkName":"' + phyNetworkName + '", "reboot":0}';
    console.debug(jsonMessage);
    ws.send(jsonMessage);
    ModalCustomAlert("Setting up local network..."); 
    setTimeout(() => {ws.send('{"menuID":"getSystemPage"}');}, 1000);
  }

  else
  {
    alertConnection();
  } 
}
function setDHCP(ethIndex,value)
{
  phyNetworkNameEl = document.getElementById("DeviceName"+ethIndex);
  dhcpmethodEl = document.getElementById("dhcpmethod"+ethIndex);
  dhcpmethodLabel = document.getElementById("dhcpmethodLabel"+ethIndex);
  ipaddressEl = document.getElementById("ipaddress"+ethIndex)
  netmaskEl = document.getElementById("netmask"+ethIndex)
  gatewayEl = document.getElementById("gateway"+ethIndex)
  dns1El = document.getElementById("dns1"+ethIndex)
  dns2El = document.getElementById("dns2"+ethIndex)

  phyNetworkName = phyNetworkNameEl.innerHTML;
  if ((value == "on") || (value == "Automatic"))
  {
    dhcpmethodLabel.innerHTML = "Automatic" ;
    dhcpmethodEl.value = "on";
    dhcpmethod = "on";
  }
  else
  {
    dhcpmethodLabel.innerHTML = "Static" ;
    dhcpmethodEl.value = "off";
    dhcpmethod = "off";
  }

  if (dhcpmethod == 'on')
  {
    ipaddressEl.disabled = true;
    netmaskEl.disabled = true;
    gatewayEl.disabled = true;
    dns1El.disabled = true;
    dns2El.disabled = true;
  }
  else
  {
    ipaddressEl.disabled = false;
    netmaskEl.disabled = false;
    gatewayEl.disabled = false;
    dns1El.disabled = false;
    dns2El.disabled = false;    
  }
}

function ModalCustomAlertReload(text)
{
    document.getElementById("ModalCustomTextAlert").innerHTML = text;
    let name = "ModalCustomAlertReload";
    let modal = null;

    if (!modal) {
      var modalElement = document.getElementById(name);
      modal = new bootstrap.Modal(modalElement);
    }
    modal.show();
}

function ModalCustomAlert(text)
{
    document.getElementById("textAlert").innerHTML = text;
    let name = "ModalCustomAlert";
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
function confirmToRebootSystem(){
  var jsonMessage = '{"menuID":"rebootSystem"}';
  if (ws.readyState == 1)
  {
      ws.send(jsonMessage);
      ModalCustomAlert("Restarting..."); 
  }
  else
  {
    alertConnection(); 
  }
}

function updateNTPServer(){
  var ntpServer1 = document.getElementById("ntpserver1").value;
  var ntpServer2 = document.getElementById("ntpserver2").value;
  var ntpServer3 = document.getElementById("ntpserver3").value;
  var ntpServer4 = document.getElementById("ntpserver4").value;
  let ntpserver = "";
  if (ntpServer1 != "") ntpserver = ntpServer1;
  if (ntpServer2 != ""){
    if (ntpserver != "")
      ntpserver += " " + ntpServer2;
    else
      ntpserver += ntpServer2;
  }
  if (ntpServer3 != ""){
    if (ntpserver != "")
      ntpserver += " " + ntpServer3;
    else
      ntpserver += ntpServer3;
  }
  if (ntpServer4 != ""){
    if (ntpserver != "")
      ntpserver += " " + ntpServer4;
    else
      ntpserver += ntpServer4;
  }
  var jsonMessage = '{"menuID":"updateNTPServer", "ntpServer":"' + ntpserver +'"}';
  if (ws.readyState == 1){
    ws.send(jsonMessage);
    ModalCustomAlert("Setting up NTP..."); 
  }else{
    alertConnection(); 
  }
}

function setLocation(){
  var location = document.getElementById("LocationList").value;
  var jsonMessage = '{"menuID":"setLocation", "location":"' + location +'"}';
  if (ws.readyState == 1){
    ws.send(jsonMessage);
    ModalCustomAlert("Setting up Time Location..."); 
  }else{
    alertConnection(); 
  }
}

function updateTime(){
  var startdate = document.getElementById("startdate").value;
  var jsonMessage = '{"menuID":"updateTime", "dateTime":"' + startdate +'"}';
  if (ws.readyState == 1){
    ws.send(jsonMessage);
    ModalCustomAlert("Setting up..."); 
  }else{
    alertConnection(); 
  }
}

function datetimeMethod(){
  if (document.getElementById("dateTimeMethod")){
    var dateTimeMethod = document.getElementById("dateTimeMethod").value;
  //  console.debug(node1Type);
    if (dateTimeMethod == 0){
      document.getElementById("divManual").style.display = "none";
      document.getElementById("divNTP").style.display = "none";
    }else if (dateTimeMethod == 2){
      document.getElementById("divManual").style.display = "contents";
      document.getElementById("divNTP").style.display = "none";
    }else if (dateTimeMethod == 1){
      document.getElementById("divManual").style.display = "none";
      document.getElementById("divNTP").style.display = "contents";
    }
  }
}


function systemupdate(){
  var jsonMessage = '{"menuID":"updateFirmware"}';
  if (ws.readyState == 1){
    ws.send(jsonMessage);
    ModalCustomAlert("System update don't turn off your device"); 
  }
  else
  {
    alertConnection(); 
  }
}
function showFileUpdate()
{
  document.getElementById("updateButton").style.display = "block";
}
function showRestoreDiv()
{
  document.getElementById("restoreDiv").style.display = "block";
}

function systembackup(){
  var jsonMessage = '{"menuID":"systembackup"}';
  if (ws.readyState == 1){
    ws.send(jsonMessage);
    setTimeout(() => {location.reload();}, 500);
  }
  else
  {
    alertConnection(); 
  }
}

function systemrestore(){
  var jsonMessage = '{"menuID":"systemrestore"}';
  if (ws.readyState == 1){
    var r = confirm("please confirm to restore!");
    if (r == true) {
      ws.send(jsonMessage);
    }else{
      
    }
  }
  else
  {
    alertConnection(); 
  }
}

function datetimeMethod(){
  var dateTimeMethod = document.getElementById("dateTimeMethod").value;
  if (dateTimeMethod == 0){
    document.getElementById("divManual").style.display = "none";
    document.getElementById("divNTP").style.display = "none";
  }else if (dateTimeMethod == 2){
    document.getElementById("divManual").style.display = "contents";
    document.getElementById("divNTP").style.display = "none";
  }else if (dateTimeMethod == 1){
    document.getElementById("divManual").style.display = "none";
    document.getElementById("divNTP").style.display = "contents";
  }
}

function systembackup(){
  var jsonMessage = '{"menuID":"systembackup"}';
  if (ws.readyState == 1){
    ws.send(jsonMessage);
    setTimeout(() => {location.reload();}, 500);
  }
  else
  {
    alert("Connection is closed...");
  }
}

function systemrestore(){
  var jsonMessage = '{"menuID":"systemrestore"}';
  if (ws.readyState == 1){
    var r = confirm("please confirm to restore!");
    if (r == true) {
      ws.send(jsonMessage);
    }else{
      
    }
  }
  else
  {
    alert("Connection is closed...");
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