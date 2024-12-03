CREATE DATABASE IF NOT EXISTS DBSAS;
USE DBSAS;

CREATE TABLE IF NOT EXISTS `usuario` (
  `Prontuario` varchar(10) NOT NULL,
  `Nome` varchar(45) NOT NULL,
  `Senha` varchar(45) NOT NULL,
  PRIMARY KEY (`Prontuario`)
);

CREATE TABLE `reserva` (
  `ID_Reserva` int NOT NULL AUTO_INCREMENT,
  `Sala` varchar(40) NOT NULL,
  `Curso` varchar(40) NOT NULL,
  `Dia` date NOT NULL,
  `Professor` varchar(10) NOT NULL,
  `Inicio` time NOT NULL,
  `Fim` time NOT NULL,
  `Descricao` varchar(45) NOT NULL,
  PRIMARY KEY (`ID_Reserva`),
  KEY `Professor_idx` (`Professor`),
  CONSTRAINT `Professor` FOREIGN KEY (`Professor`) REFERENCES `usuario` (`Prontuario`)
);