



CREATE DATABASE IF NOT EXISTS database_coursework;
USE database_coursework;



CREATE TABLE IF NOT EXISTS movie(
    id INT AUTO_INCREMENT,
    name VARCHAR(50),
    price DECIMAL(5, 2) unsigned,
    PRIMARY KEY(id));




CREATE USER IF NOT EXISTS 'database_app'@'localhost' IDENTIFIED BY 'myPassword';
GRANT ALL PRIVILEGES ON database_coursework.* TO 'database_app'@'localhost';


CREATE  TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashedPassword TEXT NOT NULL
);