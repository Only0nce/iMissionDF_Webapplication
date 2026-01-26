var currentID = -1;
var wsUri;
var ws;
var currentRoleID = 0;
var currentRoleName = "";
var setVoxId = 0;
var editRadioId = 0;
var deviceNameShow = "";

WebSocketTest();
function WebSocketTest() {

  if ("WebSocket" in window) {
     // Let us open a web socket
     wsUri = "ws://" + location.host + ":8009";
     ws = new WebSocket(wsUri);

     ws.onopen = function() {
      // if (currentRoleID <= 0)
      setTimeout(() => {ws.send('{"menuID":"getRolesPage"}');}, 100);
      if (currentRoleID > 0)
      setTimeout(() => {console.log("reconnect");ws.send('{"menuID":"getIndexPage","roleID":'+currentRoleID+'}');}, 200);
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
function alertFreq()
{
    let name = "ModalFreqAlert";
    let modal = null;

    if (!modal) {
      var modalElement = document.getElementById(name);
      modal = new bootstrap.Modal(modalElement);
    }
    modal.show();
}
function sendCommandToDevice(command,roleIndex,json=0)
{
  var roleID = document.getElementById('roleIdSelect').value;
  if (roleID <= 0) return;

  else
  {
    let text = "";
    if(json == 0)
    {
      text =  '{ "menuID"   : "sendCommandToDevice", ' +
                    '"roleIndex": '+roleIndex+', ' +
                    '"command":"'+command+'"}';
    }
    else if(json == 1)
    {
      text =  '{ "menuID"   : "sendCommandToDevice", ' +
                    '"roleIndex": '+roleIndex+', ' +
                    '"command":'+command+'}';
    }
    console.log(text);
    const jsonMessage = JSON.parse(text);        
    console.log(jsonMessage.command);
    if (ws.readyState == 1)
    {
      ws.send(text);
    }
    else
    {
      alertConnection();
      location.reload();
    }
  }
}

function sendSwitchUp(roleIndex,switchId) {
  command = 'switchUp_' + switchId;
  sendCommandToDevice(command,roleIndex)
  setTimeout(() => {sendCommandToDevice('{"menuID":"getStatusSwitch"}',roleIndex,1);}, 100);
  setTimeout(() => {sendCommandToDevice('{"menuID":"getNewName"}',roleIndex,1);}, 100);
}

function sendSwitchLow(roleIndex,switchId) {
  command = 'switchLow_' + switchId;
  sendCommandToDevice(command,roleIndex)
  setTimeout(() => {sendCommandToDevice('{"menuID":"getStatusSwitch"}',roleIndex,1);}, 100);
  setTimeout(() => {sendCommandToDevice('{"menuID":"getNewName"}',roleIndex,1);}, 100);
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
  form.submit();
}

function locationreload(roleID, method='post') 
{
  if (deviceNameShow != "")
    locationreloadDevice(roleID,deviceNameShow)
  else
  {
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
}

function connStatus(id, idInRole, numConn,numTxRx)
{
  var connStatusID = "cardTxRx" + idInRole + "_" + id;
  var disconnTextColor = "var(--bs-danger)";
  var connTextColor = "var(--bs-link-color)";
  var connStatusElement = document.getElementById(connStatusID);
  if (connStatusElement){
    if (numConn == numTxRx)
    {
      document.getElementById(connStatusID).style.borderColor = connTextColor;
    }
    else if (numConn == 0){
      document.getElementById(connStatusID).style.borderColor = disconnTextColor;
    }
    else if (numConn < numTxRx){
      document.getElementById(connStatusID).style.borderColor = connTextColor;
    }
  }
}
function onKeyInhibitChange(role_table_index,radioID,checked)
{
  editRadioId = role_table_index;
  getRadioValue(role_table_index, 'RT2200 Transmitter Mode')
}
function setVoxRadioParameter(id, value, radioID, parameter)
{
  console.log(id,value,radioID,parameter);
  editRadioId = id;
  let VOX_DOX_Mode = document.getElementById("VOX_DOX_Mode"+id);
  let VOXEnableModeDiv = document.getElementById("VOXEnableModeDiv"+id);
  let VOXVarDiv = document.getElementById("VOXVarDiv"+id);
  let applyButtonElement = document.getElementById("VOXApplyDiv"+id);
  let VOXEnableModeLabel = document.getElementById("VOXEnableModeLabel"+id);
  let VOX_DOX_ModeLabel = document.getElementById("VOX_DOX_ModeLabel"+id);
  let VOXEnableMode = document.getElementById("VOXEnableMode"+id);

  if(parameter == "SetVOX")
  {
    VOX_DOX_Mode.value = (value === 'VOX DOX Enable') ? 1 : 0;
  }

  else if(parameter == "VOXEnableMode")
  {
    VOXEnableMode.value = value;
    if (value == "Automatic Keying")
      VOXEnableModeLabel.innerHTML = "AutoKey";
    else
      VOXEnableModeLabel.innerHTML = "Monitor";
  }

  if(applyButtonElement)
    applyButtonElement.style.display = "block";
  if (VOX_DOX_Mode)
  {
    if (VOX_DOX_Mode.value == 0)
    {
      VOXEnableModeDiv.style.display = "none";
      VOXVarDiv.style.display = "none";
      VOX_DOX_ModeLabel.innerHTML = "VOX Disable";
    }
    else if (VOX_DOX_Mode.value == 1)
    {
      VOXEnableModeDiv.style.display = "block";
      VOXVarDiv.style.display = "block";
      VOX_DOX_ModeLabel.innerHTML = "VOX Enable";
    }
  }
}

function ApplyVox(role_table_index,radioID)
{
  editRadioId = role_table_index;
  getRadioValue(role_table_index, 'RT2200 Transmitter Mode')
  document.getElementById("VOXApplyDiv"+role_table_index).style.display = "none";
}
function setRadioEmissionMode(role_table_index, valueStr, value, radioID, parameter, radiotype)
{
  console.log("setRadioEmissionMode",role_table_index,value,radioID,parameter,radiotype)
  console.log("ONLY :: valueStr:"+valueStr+" value:"+value);
  document.getElementById("EmissionModeLabel"+role_table_index).innerHTML = valueStr;
  document.getElementById("EmissionMode"+role_table_index).value = valueStr;
  editRadioId = role_table_index;
  getRadioValue(role_table_index, radiotype)
}
function setAGCMode(role_table_index, valueStr, value, radioID, parameter, radiotype)
{
  console.log("setAGCMode",role_table_index,value,radioID,parameter,radiotype)
  document.getElementById("AGCModeLabel"+role_table_index).innerHTML = valueStr;
  document.getElementById("AGCMode"+role_table_index).value = value;
  editRadioId = role_table_index;
  getRadioValue(role_table_index, radiotype)
}
function setMuteMode(role_table_index, valueStr, value, radioID, parameter, radiotype)
{
  console.log("setMuteMode",role_table_index,value,radioID,parameter,radiotype,valueStr)
  document.getElementById("MuteModeLabel"+role_table_index).innerHTML = valueStr;
  document.getElementById("MuteMode"+role_table_index).value = value;
  document.getElementById("IFFilter"+role_table_index).value = value;
  document.getElementById("IFFilterLabel"+role_table_index).innerHTML = value;
  editRadioId = role_table_index;
  getRadioValue(role_table_index, radiotype)
}

function setRadioParameter(id, value, radioID, parameter,radiotype)
{
    if ((parameter == "setFrequenncy") & (value < 1500000 || value > 29999990))
    {
      alertFreq()
    }
    else
    {
      editRadioId = id;
      getRadioValue(id, radiotype)
    }
}
function getRadioValue(role_table_index, radiotype)
{
  if (radiotype == 'RT2200 Transmitter Mode')
  {
    var Emission = document.getElementById("EmissionMode"+role_table_index).value;
    var Frequenncy = document.getElementById("frequency"+role_table_index).value * 1000;
    var Radio = 'RT2200';
    var RevAGC = '';
    var RevMute = '';
    var RevRFGain = 0;
    var RevSquelch = 0;
    var BFOFrequency = 0;
    var IFFilter = 0;
    var RITFrequency = 0;
    var Type = 'transmit';
    var XmtKeying = document.getElementById("KeyInhibit"+role_table_index).checked == true ? 1 : 0;
    var XmtMode = document.getElementById("VOXEnableMode"+role_table_index).value == 'Monitor/Status' ? 0 : 1;
    var XmtPower = document.getElementById("XmtPower"+role_table_index).value;
    var XmtThreshold = document.getElementById("Threshold"+role_table_index).value;
    var XmtUnkeyDelay = document.getElementById("UnkeyDelay"+role_table_index).value*10;
    var XmtVOX = document.getElementById("VOX_DOX_Mode"+role_table_index).value;
    var settingKeys  = document.getElementById("buttonconnected"+role_table_index).value;
    sendRadioCommand(role_table_index, Emission,Frequenncy,Radio,RevAGC,RevMute,RevRFGain,RevSquelch,Type,XmtKeying,XmtMode,XmtPower,XmtThreshold,XmtUnkeyDelay,XmtVOX,settingKeys,BFOFrequency,IFFilter,RITFrequency,radiotype)

  }
  else if (radiotype == 'RT2200 Receiver Mode')
  {
    var Emission = document.getElementById("EmissionMode"+role_table_index).value;
    var Frequenncy = document.getElementById("frequency"+role_table_index).value * 1000;
    var Radio = 'RT2200';
    var RevAGC = document.getElementById("AGCMode"+role_table_index).value;
    var RevMute = document.getElementById("MuteMode"+role_table_index).value;
    var RevRFGain = document.getElementById("rfGain"+role_table_index).value;
    var RevSquelch = document.getElementById("squelch"+role_table_index).value;
    var BFOFrequency = 0;
    var IFFilter = 0;
    var RITFrequency = 0;
    var Type = 'receive';
    var XmtKeying = 0;
    var XmtMode = 1;
    var XmtPower = 100;
    var XmtThreshold = 0;
    var XmtUnkeyDelay = 0;
    var XmtVOX = 1;
    var settingKeys  = document.getElementById("buttonconnected"+role_table_index).value;
    sendRadioCommand(role_table_index, Emission,Frequenncy,Radio,RevAGC,RevMute,RevRFGain,RevSquelch,Type,XmtKeying,XmtMode,XmtPower,XmtThreshold,XmtUnkeyDelay,XmtVOX,settingKeys,BFOFrequency,IFFilter,RITFrequency,radiotype)
  }  
  else if (radiotype == 'Redifon Receiver Mode')
  {
    var Emission = document.getElementById("EmissionMode"+role_table_index).value;
    var Frequenncy = document.getElementById("frequency"+role_table_index).value * 1000;
    var Radio = 'redifon';
    var RevAGC = document.getElementById("AGCMode"+role_table_index).value;
    var RevMute = document.getElementById("MuteMode"+role_table_index).value;
    var RevRFGain = document.getElementById("rfGain"+role_table_index).value;
    var RevSquelch = 0;//document.getElementById("squelch"+role_table_index).value;
    var BFOFrequency = document.getElementById("BFOFrequency"+role_table_index).value;
    var IFFilter = document.getElementById("IFFilter"+role_table_index).value;
    console.log("ONLY IFFilter:"+IFFilter);
    var RITFrequency = document.getElementById("RITFrequency"+role_table_index).value;
    var Type = 'receive';
    var XmtKeying = 0;
    var XmtMode = 1;
    var XmtPower = 100;
    var XmtThreshold = 0;
    var XmtUnkeyDelay = 0;
    var XmtVOX = 1;
    var settingKeys  = document.getElementById("buttonconnected"+role_table_index).value;
    sendRadioCommand(role_table_index, Emission,Frequenncy,Radio,RevAGC,RevMute,RevRFGain,RevSquelch,Type,XmtKeying,XmtMode,XmtPower,XmtThreshold,XmtUnkeyDelay,XmtVOX,settingKeys,BFOFrequency,IFFilter,RITFrequency,radiotype)
  }
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

function sendRadioCommand(role_table_index, Emission,Frequenncy,Radio,RevAGC,RevMute,RevRFGain,RevSquelch,Type,XmtKeying,XmtMode,XmtPower,XmtThreshold,XmtUnkeyDelay,XmtVOX,settingKeys,BFOFrequency,IFFilter,RITFrequency,radiotype)
{
    if ((Type == "receive") & (Frequenncy < 350000 || Frequenncy > 29999990))
    {
      alertFreq();
      return;
    }
    else if((Type == "transmit") & (Frequenncy < 1500000 || Frequenncy > 29999990))
    {
      alertFreq();
      return;
    }
    else if (Radio == 'RT2200')
    {
      if(RevRFGain < 0 || RevRFGain > 75)
      {
        ModalCustomAlert("RFGain input out of range 0 - 75");
        return;
      }
      else if(RevSquelch < 0 || RevSquelch > 255){
        ModalCustomAlert("Squelch input out of range 0 - 255");
      }
    }
    else if (Radio == 'redifon')
    {
      if(RevRFGain < -110 || RevRFGain > 0)
      {
        ModalCustomAlert("RFGain input out of range (-110 - 0)");
        return;
      }
    }
    
    {
      // {"BFOFrequency":0,"IFFilter":2750,"RITFrequency":8000,"Emission":"LINK11","Frequenncy":8556699,"Radio":"REDIFON","RevAGC":"FAST","RevMute":"","RevRFGain":0,"RevSquelch":0,"Type":"RECEIVE","XmtKeying":0,"XmtMode":0,"XmtPower":100,"XmtThreshold":0,"XmtUnkeyDelay":0,"XmtVOX":0,"objectName":"UpdateParam","settingKeys":"RADIO0"}
      var obj = `{"Emission":"${Emission}","Frequenncy":${Frequenncy},"Radio":"${Radio}","RevAGC":"${RevAGC}","RevMute":"${RevMute}","RevRFGain":${RevRFGain},"RevSquelch":${RevSquelch}, "Type":"${Type}","XmtKeying":${XmtKeying},"XmtMode":${XmtMode},"XmtPower":${XmtPower}, "XmtThreshold":${XmtThreshold},"XmtUnkeyDelay":${XmtUnkeyDelay},"XmtVOX":${XmtVOX}, "objectName":"UpdateParam","settingKeys":"${settingKeys}","BFOFrequency":${BFOFrequency},"IFFilter":${IFFilter},"RITFrequency":${RITFrequency} }`;

      sendCommandToDevice(obj,role_table_index,1);
      console.log(obj);
      document.getElementById('buttonconnected'+editRadioId).focus();
    }
    editRadioId = -1;
}

function trxButtonMode(id, mode,  idInRole, pttOn, sqlOn)
{
  var txEnable;
  var rxEnable;
  var rxButtonID = "rxButton" + idInRole + "_" + id;
  var txButtonID = "txButton" + idInRole + "_" + id;
  var backgroundcolorEnable = "var(--bs-link-color)";
  var backgroundcolorDisable = "#7c7c7c73";
  var textcolorEnable = "#FFFFFF";
  var textcolorDisable = "#000000";
  var pttSqlOnBGColor = "var(--bs-warning)";
  var pttSqlOnTextColor = "#E91E63";
  
  switch (mode)
  {
    case 0: 
      txEnable = 0;
      rxEnable = 0;
      break;
    case 1:
      txEnable = 1;
      rxEnable = 1;
      break;
    case 2:
      txEnable = 1;
      rxEnable = 0;
      break;
    case 3:
      txEnable = 0;
      rxEnable = 1;
      break;
  }
  if(document.getElementById(rxButtonID)){
    if (sqlOn == 1){    
      document.getElementById(rxButtonID).style.fill = pttSqlOnBGColor;
      // document.getElementById(rxButtonID).style.color = pttSqlOnTextColor;
    }
    else if (rxEnable == 1){
      document.getElementById(rxButtonID).style.fill = backgroundcolorEnable;
      // document.getElementById(rxButtonID).style.color = textcolorEnable;
    }
    else{
      document.getElementById(rxButtonID).style.fill = backgroundcolorDisable;
      // document.getElementById(rxButtonID).style.color = textcolorDisable;
    }
  }
  if(document.getElementById(txButtonID)){
    if (pttOn == 1){
      document.getElementById(txButtonID).style.fill = pttSqlOnBGColor;
      // document.getElementById(txButtonID).style.color = pttSqlOnTextColor;
    }
    else if (txEnable == 1){
      document.getElementById(txButtonID).style.fill = backgroundcolorEnable;
      // document.getElementById(txButtonID).style.color = textcolorEnable;
    }
    else{
      document.getElementById(txButtonID).style.fill = backgroundcolorDisable;
      // document.getElementById(txButtonID).style.color = textcolorDisable;
    }
  }
}

function processMsg(message){
  // console.log(message);
  var obj = JSON.parse(message);
  // activeRoleID = obj.roleID;
  // console.log("processMsg", activeRoleID);
  if (obj.menuID == "currentRoleIdActive")
  {
    if (currentRoleID <= 0)
    {
        // setTimeout(() => {locationreload(obj.roleID);}, 100);
      // setTimeout(() => {console.log("reconnect");ws.send('{"menuID":"getIndexPage"}');}, 200);
    }
    if (document.getElementById('roleIdSelect'+obj.roleID))
      document.getElementById('roleIdSelect'+obj.roleID).className +=" active";
    if(document.getElementById('roleIdSelectLink'+obj.roleID))
      document.getElementById('roleIdSelectLink'+obj.roleID).className +=" active";
    if(document.getElementById('roleIdSelect'))
      document.getElementById('roleIdSelect').value = currentRoleID;
    // document.getElementById('buttonChangeID').value = currentRoleID;

    if (currentRoleID != obj.roleID)
    {
      // document.getElementById('buttonChangeID').style.display = "block";      
    }
    else
    {
      // document.getElementById('buttonChangeID').className =" ";
      // document.getElementById('buttonChangeID').style.display = "none";
    }

  }
  else if(obj.menuID == "DeviceDisconnected")
  {
    if (document.getElementById('connected'+obj.roleIndex))
      document.getElementById('connected'+obj.roleIndex).style.fill ="var(--bs-danger)";
  }
  else if(obj.menuID == "DeviceConnected")
  {
    if (document.getElementById('connected'+obj.roleIndex))
    document.getElementById('connected'+obj.roleIndex).style.fill ="var(--bs-link-color)";
  }
  else if(obj.menuID == "messageFromClient")
  {
    var messageObj = obj.message; 
    let id = obj.messageRoleID;
    let lastupdateEliment = document.getElementById('lastUpdate'+ id);
    // console.log(messageObj)
    if (lastupdateEliment)
    {
      lastupdateEliment.innerHTML = "Last update: " + obj.lastUpdate;
    }
    if (obj.templateID == 2) // iGate4CH DSP Client
    {
      
      if (messageObj.menuID == "connStatus")
      {
        var softPhoneID = messageObj.softPhoneID;
        
        var connNum = messageObj.connNum;
        let fillInActive = "var(--bs-link-color)";
        let fillActive = "var(--bs-warning)";
        let iGateInActive = "transparent";
        let iGateActive = "transparent";
        var buttonTx = "buttonTx"+softPhoneID+"_"+id;
        var buttonRx = "buttonRx"+softPhoneID+"_"+id;
        var cardTxRx = "cardTxRx"+softPhoneID+"_"+id;
        var elementTx = document.getElementById(buttonTx);
        var elementRx = document.getElementById(buttonRx);
        var elementTxRx = document.getElementById(cardTxRx);
        // console.log(buttonTx,elementTx,buttonRx,elementRx);
        var txOn = ((messageObj.TxRx == "Tx")||(messageObj.TxRx == "TRx") || (messageObj.TxRx == "Tx&Rx"))
        var rxOn = ((messageObj.TxRx == "Rx")||(messageObj.TxRx == "TRx") || (messageObj.TxRx == "Tx&Rx"))
        
        
        if(elementTxRx)
        {
          if (connNum > 0){
            elementTxRx.style.backgroundColor = iGateActive;
            if(elementTx)
            {
              elementTx.style.fill = txOn ?  fillActive : fillInActive;
            }
            if(elementRx)
            {
              elementRx.style.fill = rxOn ?  fillActive : fillInActive;
            }
          }
          else{
            elementTxRx.style.backgroundColor = iGateInActive;
            if(elementTx)
              elementTx.style.fill = "#7c7c7c73";
            if(elementRx)
              elementRx.style.fill = "#7c7c7c73";
          }
        }
      }

    }
    else if (obj.templateID == 8) // iCon10
    {
      if (messageObj.menuID == "channelMessage")
      {
        var idInRole  = messageObj.idInRole;
        var trxMode   = messageObj.trxMode;
        var mainTxPTTOn = Boolean(messageObj.mainTxPTTOn) || Boolean(messageObj.standbyTxPTTOn);
        var mainRxSQLOn = Boolean(messageObj.mainRxSQLOn) || Boolean(messageObj.standbyRxSQLOn);
        var numConn   = messageObj.numConn;
        var numTxRx   = messageObj.numTxRx;
        var channelID   = messageObj.channelID;

          if (channelID > 0)
          {
            trxButtonMode(id, trxMode,idInRole,mainTxPTTOn,mainRxSQLOn);
            connStatus(id, idInRole, numConn,numTxRx);
          }
          else
          {
            trxButtonMode(id, trxMode,idInRole,mainTxPTTOn,mainRxSQLOn);
            connStatus(id, idInRole, numConn,1);
          }
      }
    } 
    else if (obj.templateID == 10) // DPSU
    {
      if (messageObj.menuID == "psuIVData")
      {
        var vmain = messageObj.vmain;
        var iOut1 = messageObj.iOut1;
        var iOut2 = messageObj.iOut2;
        var iOut3 = messageObj.iOut3;
        var vbatt = messageObj.vbatt;
        var pMain = (vmain*(iOut1+iOut2+iOut3)).toFixed(0)+'W';
        var p1 = (vmain*iOut1).toFixed(0)+'W';
        var p2 = (vmain*iOut2).toFixed(0)+'W';
        var p3 = (vmain*iOut3).toFixed(0)+'W';

        let elementVMain = document.getElementById("vOut0_"+id);
        let elementPMain = document.getElementById("pOut0_"+id);
        let elementIMain = document.getElementById("iOut0_"+id);
        let elementIOut1 = document.getElementById("iOut1_"+id);
        let elementIOut2 = document.getElementById("iOut2_"+id);
        let elementIOut3 = document.getElementById("iOut3_"+id);
        let elementPOut1 = document.getElementById("pOut1_"+id);
        let elementPOut2 = document.getElementById("pOut2_"+id);
        let elementPOut3 = document.getElementById("pOut3_"+id);    
        let elementVbatt = document.getElementById("vbatt_"+id);        

// console.log(elementVMain);
        if(elementVbatt)
          elementVbatt.innerHTML = (vbatt*1.0).toFixed(1)+'V';
        if(elementVMain)
          elementVMain.innerHTML = (vmain*1.0).toFixed(1)+'V';
        if(elementPMain)
          elementPMain.innerHTML = pMain;
        if(elementPOut1)
          elementPOut1.innerHTML = p1;
        if(elementPOut2)
          elementPOut2.innerHTML = p2;
        if(elementPOut3)
          elementPOut3.innerHTML = p3;
        if(elementIMain)
          elementIMain.innerHTML = ((iOut1+iOut2+iOut3)*1).toFixed(1)+'A';
        if(elementIOut1)
          elementIOut1.innerHTML = (iOut1*1).toFixed(1)+'A';
        if(elementIOut2)
          elementIOut2.innerHTML = (iOut2*1).toFixed(1)+'A';
        if(elementIOut3)
          elementIOut3.innerHTML = (iOut3*1).toFixed(1)+'A';
      }
    }
    else if (obj.templateID == 11) // Power Sensor
    {
      if (messageObj.menuID == "view_transmitter_list")
      {
        var fwdPowerDB = messageObj.fwdPowerDB;
        var fwdPowerWatt = messageObj.fwdPowerWatt;
        var rwdPowerDB = messageObj.rwdPowerDB;
        var rwdPowerWatt = messageObj.rwdPowerWatt;
        var vswr = messageObj.vswr;

        let element_fwdPowerDB = document.getElementById("fwdPowerDB_"+id);
        let element_fwdPowerWatt = document.getElementById("fwdPowerWatt_"+id);
        let element_rwdPowerDB = document.getElementById("rwdPowerDB_"+id);
        let element_rwdPowerWatt = document.getElementById("rwdPowerWatt_"+id);
        let element_vswr = document.getElementById("vswr_"+id);

        if (element_fwdPowerDB)
          element_fwdPowerDB.innerHTML = fwdPowerDB.toFixed(1) + 'dBm'
        if (element_fwdPowerWatt)
          element_fwdPowerWatt.innerHTML = (fwdPowerWatt/1).toFixed(1) + 'W'
        if (element_rwdPowerDB)
          element_rwdPowerDB.innerHTML = rwdPowerDB.toFixed(1) + 'dBm'
        if (element_rwdPowerWatt)
          element_rwdPowerWatt.innerHTML = (rwdPowerWatt/1).toFixed(1) + 'W'
        if (element_vswr)
          element_vswr.innerHTML = vswr.toFixed(3)
      }

    }
    else if (obj.templateID == 12) // VoiceWay
    {
      let fillActive = "var(--bs-link-color)";
      let fillInActive = "#7c7c7c73";
      if (messageObj.menuID == "getStatusSwitch")
      {
        for (var key in messageObj) 
        {
            if (messageObj.hasOwnProperty(key) && key.startsWith("switchUp_") || key.startsWith("switchLow_")) 
            {
                var status = messageObj[key];
                var buttonVWUP = key.replace('switchUp_', 'svgVWUp') + "_" + id;
                var buttonVWDown = key.replace('switchLow_', 'svgVWDown') + "_" + id;
                var elementbuttonVWUP = document.getElementById(buttonVWUP);
                var elementbuttonVWDown = document.getElementById(buttonVWDown);
                var iostatus = status == "on";
                if (elementbuttonVWUP) 
                {
                    elementbuttonVWUP.style.fill = iostatus ?  fillActive : fillInActive;
                }

                if (elementbuttonVWDown) 
                {
                    elementbuttonVWDown.style.fill = iostatus ?  fillActive : fillInActive;
                }
            }
        }
      }
    }
    else if (obj.templateID == 13) // VoiceX
    {
      let fillActive = "var(--bs-link-color)";
      let fillInActive = "#7c7c7c73";
      if (messageObj.menuID == "channelActive")
      {
        var radioServerRoleID = messageObj.roleID;
        var radioServerCallIn = messageObj.callInNum;
        var radioServerCallOut = messageObj.callOutChannelActive;
        var callOutNum = "callOutNum"+radioServerRoleID + "_" + id;
        var callInNum = "callInNum"+radioServerRoleID + "_" + id;
        if (document.getElementById(callOutNum)){
          document.getElementById(callOutNum).innerHTML = radioServerCallOut;
          if (radioServerCallOut > 0){            
            document.getElementById(callOutNum).style.backgroundColor = "var(--bs-link-color)";
          }
          else
          {
            document.getElementById(callOutNum).style.backgroundColor = "var(--bs-warning)";
          }
        }
        if (document.getElementById(callInNum)){
          document.getElementById(callInNum).innerHTML = radioServerCallIn;
          if(radioServerCallIn > 0){            
            document.getElementById(callInNum).style.backgroundColor = "var(--bs-link-color)";
          }
          else
          {
            document.getElementById(callInNum).style.backgroundColor = "var(--bs-warning)";
          }
        }
      }
    }
    else if ((obj.templateID == 5)||(obj.templateID == 6)||(obj.templateID == 7)) // Radio
    {
      // {"Emission":"LSB","Frequenncy":1500000,"Radio":"RT2200","RevAGC":"","RevMute":"","RevRFGain":0,"RevSquelch":0,"Type":"TRANSMIT","XmtKeying":0,"XmtMode":0,"XmtPower":58,"XmtThreshold":0,"XmtUnkeyDelay":0,"XmtVOX":1,"objectName":"Param","settingKeys":"RADIO0"}
      if ((messageObj.menuID == "Param") & (id != editRadioId))
      {
        let activeElement = document.activeElement;
        let settingKeys  = document.getElementById("buttonconnected"+id);
        let freqElement = document.getElementById("frequency" + id);
        let EmissionMode = document.getElementById("EmissionMode" + id);
        let EmissionModeLabel = document.getElementById("EmissionModeLabel" + id);
        let AGCMode = document.getElementById("AGCMode" + id);
        let AGCModeLabel = document.getElementById("AGCModeLabel" + id);
        let MuteMode = document.getElementById("MuteMode" + id);
        let MuteModeLabel = document.getElementById("MuteModeLabel" + id);
        let squelch = document.getElementById("squelch" + id);
        let rfGain = document.getElementById("rfGain" + id);
        let BFOFrequency = document.getElementById("BFOFrequency" + id);
        let IFFilter = document.getElementById("IFFilter" + id);
        let IFFilterLabel = document.getElementById("IFFilterLabel" + id);
        let RITFrequency = document.getElementById("RITFrequency" + id);

        if (settingKeys){
          settingKeys.value = messageObj.settingKeys
        }
        if (freqElement){
          if (freqElement!= activeElement)
            freqElement.value = (messageObj.Frequenncy / 1000).toFixed(3);
        }
        if (EmissionMode){
          if (EmissionMode!= activeElement)
            EmissionMode.value = messageObj.Emission
        }
        if (EmissionModeLabel){
          if (EmissionModeLabel!= activeElement)
            EmissionModeLabel.innerHTML = messageObj.Emission
        }

        if(obj.templateID == 5)
        {
          if (AGCMode){
            if (AGCMode!= activeElement)
            AGCMode.value = messageObj.RevAGC
          }
          if (AGCModeLabel){
            if (AGCModeLabel!= activeElement)
            AGCModeLabel.innerHTML = messageObj.RevAGC
          }
          if (MuteMode){
            if (MuteMode!= activeElement)
            MuteMode.value = messageObj.RevMute
          }
          if (squelch){
            if (squelch!= activeElement)
            squelch.value = messageObj.RevSquelch
          }
          if (rfGain){
            if (rfGain!= activeElement)
            rfGain.value = messageObj.RevRFGain
          }
        }
        else if(obj.templateID == 7)
        {
          if (AGCMode){
            if (AGCMode!= activeElement)
            AGCMode.value = messageObj.RevAGC
          }
          if (AGCModeLabel){
            if (AGCModeLabel!= activeElement)
            AGCModeLabel.innerHTML = messageObj.RevAGC
          }
          if (rfGain){
            if (rfGain!= activeElement)
            rfGain.value = messageObj.RevRFGain
          }
          if (RITFrequency){
            if (RITFrequency!= activeElement)
            RITFrequency.value = messageObj.RITFrequency
          }
          if (IFFilter){
            if (IFFilter!= activeElement)
            IFFilterLabel.innerHTML = messageObj.IFFilter
          }
          if (RITFrequency){
            if (RITFrequency!= activeElement)
            RITFrequency.value = messageObj.RITFrequency
          }
        }
        else if(obj.templateID == 6)
        {
          // console.log(messageObj);
          var XmtKeyingValue = messageObj.XmtKeying;
          var XmtMode = messageObj.XmtMode;
          var XmtPowerVal = messageObj.XmtPower;
          var XmtThreshold = messageObj.XmtThreshold;
          var XmtUnkeyDelay = messageObj.XmtUnkeyDelay;
          var XmtVOX = messageObj.XmtVOX;

          let VOX_DOX_Mode = document.getElementById("VOX_DOX_Mode"+id);
          let VOXEnableModeDiv = document.getElementById("VOXEnableModeDiv"+id);
          let VOXEnableMode = document.getElementById("VOXEnableMode"+id);
          let VOXVarDiv = document.getElementById("VOXVarDiv"+id);
          let applyButtonElement = document.getElementById("VOXApplyDiv"+id);
          let VOX_DOX_ModeLabel = document.getElementById("VOX_DOX_ModeLabel"+id);
          let VOXEnableModeLabel = document.getElementById("VOXEnableModeLabel"+id);
          let XmtPower = document.getElementById("XmtPower"+id);
          let Threshold = document.getElementById("Threshold"+id);
          let UnkeyDelay = document.getElementById("UnkeyDelay"+id);
          let XmtKeying = document.getElementById("KeyInhibit"+id)

          if(VOXEnableMode)
            VOXEnableMode.value = XmtMode;
          if(VOX_DOX_Mode)
            VOX_DOX_Mode.value = XmtVOX;
          if(XmtPower)
            XmtPower.value = XmtPowerVal;
          if(Threshold)
            Threshold.value = XmtThreshold;
          if(UnkeyDelay)
            UnkeyDelay.value = (XmtUnkeyDelay/10).toFixed(1);
          if(XmtKeying)
            XmtKeying.checked = (XmtKeyingValue != 0);

          if((XmtMode == 0) & (VOXEnableModeLabel))
          {
            VOXEnableModeLabel.innerHTML = "Monitor";

          }
          else if((XmtMode == 1) & (VOXEnableModeLabel))
          {
            VOXEnableModeLabel.innerHTML = "AutoKey";
          }
          

          if(applyButtonElement)
            applyButtonElement.style.display = "none";
          if (VOX_DOX_Mode)
          {
            if (VOX_DOX_Mode.value == 0)
            {
              VOXEnableModeDiv.style.display = "none";
              VOXVarDiv.style.display = "none";
              VOX_DOX_ModeLabel.innerHTML = "VOX Disable";
            }
            else if (VOX_DOX_Mode.value == 1)
            {
              VOXEnableModeDiv.style.display = "block";
              VOXVarDiv.style.display = "block";
              VOX_DOX_ModeLabel.innerHTML = "VOX Enable";
            }
          }
        }

      }
      else if (messageObj.menuID == "Status")
      {
        // console.log(messageObj)
        if(messageObj.Connection != "Connected")
        {
          if(document.getElementById('connected'+id))
            document.getElementById('connected'+id).style.fill ="var(--bs-danger)";
        }
        else{
          if(document.getElementById('connected'+id))
          document.getElementById('connected'+id).style.fill ="var(--bs-link-color)";
        }
      }

    }
    else
    {
      console.log(message)
    }
  }
  // else if(obj.menuID == "messageFromClient")
  // {
  //   if (obj.templateID == 12) // VoiceWay
  //   {
  //     let classActive = "active";
  //     let classInactive = "inactive";
  //     let id = obj.messageRoleID;
  //     var messageObj = obj.message; 
  //     if (messageObj.menuID == "getStatusSwitch")
  //     {
  //       for (var key in messageObj) 
  //       {
  //           if (messageObj.hasOwnProperty(key) && key.startsWith("switchUp_") || key.startsWith("switchLow_")) {
  //               var status = messageObj[key];
  //               var buttonVWUP = key.replace('switchUp_', 'svgVWUp') + "_" + id;
  //               var buttonVWDown = key.replace('switchLow_', 'svgVWDown') + "_" + id;
  //               var elementbuttonVWUP = document.getElementById(buttonVWUP);
  //               var elementbuttonVWDown = document.getElementById(buttonVWDown);
  //               var iostatus = status == "on";
  //               if (elementbuttonVWUP) 
  //               {
  //                   var ClassRemove = iostatus == false ?  classActive : classInactive;
  //                   elementbuttonVWUP.classList.remove(ClassRemove);
  //                   var newClassName = iostatus ?  classActive : classInactive;
  //                   elementbuttonVWUP.classList.add(newClassName);
  //                   console.log(elementbuttonVWUP.className);
  //               }
  //               if (elementbuttonVWDown) 
  //               {                    
  //                   var newClassName = iostatus ?  classActive : classInactive;
  //                   var ClassRemove = iostatus == false ?  classActive : classInactive;
  //                   elementbuttonVWDown.classList.add(newClassName);
  //                   elementbuttonVWDown.classList.remove(ClassRemove);
  //                   console.log(elementbuttonVWDown);
  //               }
  //           }
  //       }
  //     }
  //   }
  // }
  else
  {
    console.log(message)
  }

}
function setCurrentRoleId(user, roleID, roleName, deviceName)
{  
  currentRoleID = roleID;
  currentRoleName = roleName;
  userID = user;
  deviceNameShow = deviceName;
  console.log("setCurrentRoleId",roleID,roleName, deviceName);

    if (currentRoleID <= 0)
    {

    }else {
      document.getElementById('roleIdSelect'+roleID).className +=" active";
      document.getElementById('roleIdSelectLink'+roleID).className +=" active";
      document.getElementById('roleIdSelect').value = roleID;
    }
}
function selectRoleID(id,roleName,array)
{
    locationreload(id);
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

function setUserID(user, role)
{
  userID = user;
  roleID = role;
}

