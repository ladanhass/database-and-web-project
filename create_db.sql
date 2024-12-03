



CREATE DATABASE IF NOT EXISTS database_coursework;
USE database_coursework;


CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED BY 'root1234';
GRANT ALL PRIVILEGES ON database_coursework.* TO 'root'@'localhost';


CREATE  TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashedPassword TEXT NOT NULL
);