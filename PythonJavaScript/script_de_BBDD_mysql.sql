CREATE DATABASE IF NOT EXISTS python;
use python;
drop table IF EXISTS usuarios;

create table IF NOT EXISTS usuarios(
password varchar(255),
username varchar(255) PRIMARY KEY,
id int NOT NULL AUTO_INCREMENT,
fecha DATETIME,
KEY (id)
);