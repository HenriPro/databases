var mysql = require('mysql');


exports.dbConnection = () => { 
  return mysql.createConnection({
    user: 'root',
    password: 'plantlife',
    database: 'chat'
  });
};

exports.buildField = (obj, tableName, fieldName, cb) => {

  var connection = exports.dbConnection();
  connection.connect();
  
  var insertString = `INSERT INTO ${tableName} (${fieldName}) VALUES ("${obj[tableName]}");`;
  var insertArgs = [];
  console.log('INSERTING ', insertString);
  connection.query(insertString, insertArgs, function(err, results) {
    if (err) {
      console.log('Error inserting into ', tableName, fieldName, err);
      cb(err);
    } else {
      console.log('Successfully inserted into ', tableName, fieldName, results);
      cb(results);
    }
    connection.end();
  });

};
 

exports.buildMessage = (obj, cb) => {
  // console.log('HEREEERERE', obj.username, obj.roomname, obj.text);
  var connection = exports.dbConnection();
  connection.connect();

  // SELECT id from users WHERE username ="${obj.username}"
  exports.getIdFromTable('username', obj.username, 'users', (userId) => {
    exports.getIdFromTable('roomname', obj.roomname, 'rooms', (roomId) => {
      var insertString = `INSERT INTO messages (userID, text, roomID) VALUES (${userId}, "${obj.text}", ${roomId});`;
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
  // console.log('Inside getIdFromTable with parameters: ', key, searchValue, tableName);
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
  
  var querryString = `SELECT m.id as objectId, u.username, m.text, r.roomname 
                      FROM messages m INNER JOIN users u ON m.userID=u.id INNER JOIN rooms r on m.roomID=r.id;`;
  var insertArgs = [];
  console.log('SELECTING ', querryString);
  connection.query(querryString, insertArgs, function(err, results) {
    if (err) {
      console.log(`Error getting all messages`, err);
      cb(err);
    } else {
      console.log('Successfully got all messages');
      cb(results);
    }
    connection.end();
  });
};


// exports.getAllMessages({}, (messages)=> {
//   console.log('***** MESSAGES: ', messages);
// });


