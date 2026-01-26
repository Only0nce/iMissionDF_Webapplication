<?php
$gainAudioOut = array("MUTE","-54.0 dB", "-48.0 dB","-42.0 dB","-40.5 dB","-39.0 dB","-37.5 dB","-36.0 dB","-34.5 dB","-33.0 dB","-31.5 dB","-30.0 dB","-28.5 dB","-27.0 dB","-25.5 dB","-24.0 dB","-22.5 dB","-21.0 dB","-19.5 dB","-18.0 dB","-16.5 dB","-15.0 dB","-13.5 dB","-12.0 dB","-10.5 dB"," -9.0 dB"," -7.5 dB"," -6.0 dB"," -4.5 dB"," -3.0 dB"," -1.5 dB","    0 dB");

$gainAudioIn = array("MUTE","54.0 dB", "48.0 dB","42.0 dB","40.5 dB","39.0 dB","37.5 dB","36.0 dB","34.5 dB","33.0 dB","31.5 dB","30.0 dB","28.5 dB","27.0 dB","25.5 dB","24.0 dB","22.5 dB","21.0 dB","19.5 dB","18.0 dB","16.5 dB","15.0 dB","13.5 dB","12.0 dB","10.5 dB"," 9.0 dB"," 7.5 dB"," 6.0 dB"," 4.5 dB"," 3.0 dB"," 1.5 dB","   0 dB");
$siteTone = array("MUTE", "10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%");
$nodeActive = array("Disable","Enable");

$nodeType = array("Transceiver", "Transmitter", "Receiver", "Separate Tx/Rx");

$audioInterface = array("RJ-45","DB-9");

$dhcpmethod = array("Static","Automatic");

$pttScheduler = array("Node 1","Node 2","Tx All Node","Odd & Even day", "Odd & Even Hour", "AM & PM", "PTT Disable");

$txControl = array("None","IC-FR Series","PARK AIR T6");

$ioPortList = array("Port: 1","Port: 2","Port: 3","Port: 4");

$rolesList = array();
$deviceListInRole = array();
$rowDeviceListQuery = array();
$VOX_DOX_Mode = array("VOX DOX Disable","VOX DOX Enable");
$AGCMode = array("Off","Voice","Data","Medium","FAX","ISB Data");
$AGCModeValue = array("OFF","VOICE","DATA","MEDIUM","FAX","ISB DATA");
$RedifonAGCMode = array("OFF","SLOW","MEDIUM","FAST");
$VOXEnableMode = array("Monitor/Status","Automatic Keying");
$MuteMode = array("Unmute","Automatic","Mute");
$MuteModeValue = array("unmute","automatic","mute");
$EmissionMode = array("USB","LSB-A","AM","CW","ISB","AME USB");
$EmissionValue = array("USB","LSB","AM","CW","ISB","AME");
$RedifonEmissionMode = array("ISB","AM","CW","USB","LSB","FSK","SSB","LINK 11","CENTERED FSK","CENTERED CW","LINK 11 STANAG","MCW");
$RedifonEmissionValue = array("ISB","AM","CW","USB","LSB","FSK","SSB","LINK 11","CENTEREDFSK","CENTEREDCW","LINK11STANAG","MCW");
$userLevel = array("Administrator","Regular user");
$IFFilterValue = array(300,1100,2300,2400,2750,3100,5000,6000);
$EthPhyNameList = array("LAN1","LAN2","RFSoC1","RFSoC2");
?>