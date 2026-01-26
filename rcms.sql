-- MySQL dump 10.13  Distrib 5.7.33, for Linux (aarch64)
--
-- Host: localhost    Database: rcms
-- ------------------------------------------------------
-- Server version	5.7.33-0ubuntu0.18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `datalogger`
--

DROP TABLE IF EXISTS `datalogger`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `datalogger` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `timestamp` int(11) DEFAULT NULL,
  `description` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `datalogger`
--

LOCK TABLES `datalogger` WRITE;
/*!40000 ALTER TABLE `datalogger` DISABLE KEYS */;
/*!40000 ALTER TABLE `datalogger` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deviceList`
--

DROP TABLE IF EXISTS `deviceList`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `deviceList` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) DEFAULT NULL,
  `templateID` int(11) DEFAULT NULL,
  `ipaddress` varchar(15) DEFAULT NULL,
  `roleID` int(11) DEFAULT NULL,
  `roleName` varchar(32) DEFAULT NULL,
  `userID` int(11) DEFAULT NULL,
  `username` varchar(50) DEFAULT 'admin',
  `password` varchar(50) DEFAULT 'password',
  `radioIoPort` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deviceList`
--

LOCK TABLES `deviceList` WRITE;
/*!40000 ALTER TABLE `deviceList` DISABLE KEYS */;
INSERT INTO `deviceList` VALUES (2,'iCon 10',8,'192.168.10.27',1,'Yotaka',1,'admin','password',1),(3,'VoiceX',13,'192.168.10.21',1,'Yotaka',1,'admin','password',1),(4,'iCon4',9,'192.168.10.12',1,'Yotaka',1,'admin','password',1),(5,'RT2200 Rx Mode: Port 1',5,'192.168.10.24',1,'Yotaka',1,'admin','password',1),(6,'PSU',10,'192.168.10.12',1,'Yotaka',1,'admin','password',1),(7,'RT2200 Rx Mode: Port 2',5,'192.168.10.25',1,'Yotaka',1,'admin','password',2),(8,'RT2200 Tx Mode: Port 2',6,'192.168.10.25',1,'Yotaka',1,'admin','password',2),(9,'Redifon Rx Mode: Port 1',7,'192.168.10.24',1,'Yotaka',1,'admin','password',1),(10,'Power Sersor',11,'192.168.10.12',1,'Yotaka',1,'admin','password',1),(11,'Power Sersor',11,'192.168.10.12',1,'Yotaka',1,'admin','password',1),(12,'Power Sersor',11,'192.168.10.12',1,'Yotaka',1,'admin','password',1),(13,'Power Sersor',11,'192.168.10.12',1,'Yotaka',1,'admin','password',1),(21,'Test Add',2,'192.168.10.12',1,'',1,'admin','password',1),(22,'Test Add',2,'192.168.10.18',1,'',1,'admin','password',1),(23,'New iCon',8,'192.168.10.12',1,'',1,'admin','password',1),(25,'VoiceWay 1',12,'192.168.10.55',1,'YOTAKA 1',1,'admin','password',1),(26,'RT2200 Tx Mode: Port 1',6,'192.168.10.25',1,'YOTAKA 1',1,'admin','password',1),(27,'Redifon: Port 3',7,'192.168.10.25',NULL,NULL,2,'admin','password',3);
/*!40000 ALTER TABLE `deviceList` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deviceTemplate`
--

DROP TABLE IF EXISTS `deviceTemplate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `deviceTemplate` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(32) DEFAULT NULL,
  `subType` int(11) DEFAULT NULL,
  `databaseUser` varchar(32) DEFAULT NULL,
  `databasePassword` varchar(32) DEFAULT NULL,
  `databaseName` varchar(32) DEFAULT NULL,
  `socketPort` int(11) DEFAULT NULL,
  `description` varchar(256) DEFAULT NULL,
  `iconName` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deviceTemplate`
--

LOCK TABLES `deviceTemplate` WRITE;
/*!40000 ALTER TABLE `deviceTemplate` DISABLE KEYS */;
INSERT INTO `deviceTemplate` VALUES (1,'iGate4CH',1,NULL,NULL,NULL,1234,'iGate DSP 4CH Server Mode','gateway'),(2,'iGate4CH',2,NULL,NULL,NULL,1234,'iGate DSP 4CH Client Mode','gateway'),(3,'iGate4CH',3,NULL,NULL,NULL,1234,'iGate 4CH Server Mode','gateway'),(4,'iGate4CH',4,NULL,NULL,NULL,1234,'iGate 4CH Client Mode','gateway'),(5,'Radio',1,NULL,NULL,NULL,1238,'RT2200 Receiver Mode','radio3'),(6,'Radio',2,NULL,NULL,NULL,1238,'RT2200 Transmitter Mode','radio2'),(7,'Radio',3,NULL,NULL,NULL,1238,'Redifon Receiver Mode','radio3'),(8,'CWP',1,NULL,NULL,NULL,1234,'iCon 10 Channels','cwp'),(9,'CWP',2,NULL,NULL,NULL,1234,'iCon 4 Channels','cwp'),(10,'PSU',1,NULL,NULL,NULL,1234,'Digital PSU','psu'),(11,'Power Sensor',1,NULL,NULL,NULL,1234,'Power Sensor','powerSensor'),(12,'VoiceWay',1,NULL,NULL,NULL,1234,'Voice Way','switch'),(13,'Radio Server',1,NULL,NULL,NULL,1234,'VoiceX Radio Server','voicex');
/*!40000 ALTER TABLE `deviceTemplate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `member` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(32) DEFAULT NULL,
  `password` varchar(512) DEFAULT NULL,
  `userlevel` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member` VALUES (1,'supperadmin','*E6CC90B878B948C35E92B003C792C46C58C4AF40',1),(2,'admin','*2470C0C06DEE42FD1618BB99005ADCA2EC9D1E19',1);
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `visible` tinyint(1) NOT NULL DEFAULT '1',
  `deviceID` int(11) NOT NULL DEFAULT '0',
  `deviceIdInRole` int(11) NOT NULL DEFAULT '1',
  `roleName` varchar(45) DEFAULT NULL,
  `roleID` int(11) NOT NULL DEFAULT '0',
  `userID` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=71 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (66,1,9,5,'My Role ID1',6,2),(45,1,1,1,'My Role ID1',6,2);
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-08 15:06:09
