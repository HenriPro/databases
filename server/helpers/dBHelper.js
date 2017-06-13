var mysql = require('mysql');


exports.dbConnection = () => { 
  return mysql.createConnection({
    user: 'root',
    password: 'plantlife',
    database: 'chat'
  });
};

exports.buildUser = (obj, cb) => {
  var connection = exports.dbConnection();
  connection.connect();
  
  var insertString = `INSERT INTO users (username) VALUES ("${obj.username}");`;
  var insertArgs = [];
  console.log('INSERTING ', insertString);
  connection.query(insertString, insertArgs, function(err, results) {
    if (err) {
      console.log('Error inserting into users', err);
      cb(err);
    } else {
      console.log('Successfully inserted into users', results);
      cb(results);
    }
    connection.end();
  });
  
};  

exports.buildMessage = (obj, cb) => {
  var connection = exports.dbConnection();
  connection.connect();
  exports.getIdFromTable('username', obj.username, 'users', (userId) => {
    exports.getIdFromTable('roomname', obj.roomname, 'rooms', (roomId) => {
      var insertString = `INSERT INTO messages (userID, text, roomID) VALUES (${userId}, "${obj.message}", ${roomId});`;
      var insertArgs = [];
      console.log('INSERTING ', insertString);
      connection.query(insertString, insertArgs, function(err, results) {
        if (err) {
          console.log('Error inserting into messages', err);
          cb(err);
        } else {
          console.log('Successfully inserted into messages', results);
          cb(results);
        }
        connection.end();
      });
    });
  });
  
};  

//roomname, searchvalue, rooms
//username, searchvalue, users
exports.getIdFromTable = (key, searchValue, tableName, cb) => {
  console.log('Inside getIdFromTable with parameters: ', key, searchvalue, tableName);
  var connection = exports.dbConnection();
  connection.connect();
  
  var querryString = `SELECT ID from ${tableName} WHERE ${key} = (${connection.escape(searchValue)});`;
  var insertArgs = [];
  console.log('SELECTING ', querryString);
  connection.query(querryString, insertArgs, function(err, results) {
    if (err) {
      console.log(`Error SELECTING into ${tableName}`, err);
      cb(err);
    } else {
      console.log('Successfully SELECTED', results);
      cb(results[0].ID);
    }
    connection.end();
  });
};

exports.getAllMessages = (req, cb) => {
  var connection = exports.dbConnection();
  connection.connect();
  
  var querryString = `SELECT u.username, m.text, r.roomname FROM messages m INNER JOIN users u ON m.userID=u.id INNER JOIN rooms r on m.roomID=r.id;`;
  var insertArgs = [];
  console.log('SELECTING ', querryString);
  connection.query(querryString, insertArgs, function(err, results) {
    if (err) {
      console.log(`Error getting all messages`, err);
      cb(err);
    } else {
      console.log('Successfully got all messages', results);
      cb(results);
    }
    connection.end();
  });
};


// exports.getAllMessages({}, (messages)=> {
//   console.log('***** MESSAGES: ', messages);
// });


