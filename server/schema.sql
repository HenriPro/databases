CREATE DATABASE chat;

USE chat

CREATE TABLE rooms (
  id INT(11) PRIMARY KEY NOT NULL,
  roomname VARCHAR(255) NOT NULL
);

CREATE TABLE users (
  id INT(11) PRIMARY KEY NOT NULL,
  username VARCHAR(255) NOT NULL
);

CREATE TABLE rooms_users (
  roomID INT(11) NOT NULL,
  userID INT(11) NOT NULL,
  CONSTRAINT PK_RoomsUsers PRIMARY KEY(roomID, userID),
  FOREIGN KEY (roomID) REFERENCES rooms (id),
  FOREIGN KEY (userID) REFERENCES users (id) 
);

CREATE TABLE messages (
  id INT(11) PRIMARY KEY NOT NULL,
  userID INT(11),
  text VARCHAR(255),
  roomID INT(11),
  FOREIGN KEY (userID) REFERENCES users (id),
  FOREIGN KEY (roomID) REFERENCES rooms (id) 
);

/* Create other tables and define schemas for them here! */




/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/

