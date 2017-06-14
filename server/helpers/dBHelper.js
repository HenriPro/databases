var mysql = require('mysql');
const Sequelize = require('sequelize');
const db = new Sequelize('chat', 'root', 'plantlife');

exports.dbConnection = () => { 
  return mysql.createConnection({
    user: 'root',
    password: 'plantlife',
    database: 'chat'
  });
};

var Users = db.define('users', {
  username: Sequelize.STRING
}, {timestamps: false});

var Rooms = db.define('rooms', {
  roomname: Sequelize.STRING
}, {timestamps: false});

var Messages = db.define('messages', {
  userID: Sequelize.INTEGER,
  text: Sequelize.STRING,
  roomID: Sequelize.INTEGER
}, {timestamps: false});


//Relationships
Messages.belongsTo(Users, {foreignKey: 'userID', targetKey: 'id'});
Users.hasMany(Messages, {foreignKey: 'userID'});

Messages.belongsTo(Rooms, {foreignKey: 'roomID', targetKey: 'id'});
Rooms.hasMany(Messages, {foreignKey: 'roomID'});

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
  
  Messages.create( {userID: ''})
};
 

// exports.buildMessage = (obj, cb) => {
//   // console.log('HEREEERERE', obj.username, obj.roomname, obj.text);
//   var connection = exports.dbConnection();
//   connection.connect();

//   // SELECT id from users WHERE username ="${obj.username}"
//   exports.getIdFromTable('username', obj.username, 'users', (userId) => {
//     exports.getIdFromTable('roomname', obj.roomname, 'rooms', (roomId) => {
//       var insertString = `INSERT INTO messages (userID, text, roomID) VALUES (${userId}, "${obj.text}", ${roomId});`;
//       var insertArgs = [];
//       console.log('INSERTING ', insertString);
//       connection.query(insertString, insertArgs, function(err, results) {
//         if (err) {
//           console.log('Error inserting into messages', err);
//           cb(err);
//         } else {
//           console.log('Successfully inserted into messages', results);
//           cb(results);
//         }
//         connection.end();
//       });
//     });
//   });
  
// };  

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

  db.sync()
    .then( () => {
      
      return Messages.findAll( { include: [{model: Users}, {model: Rooms}], attributes: ['id', 'text'] } );
     
    })
    .then( (messages) => {

      var messagesTransformed = messages.map( message => {
        message.dataValues.username = message.dataValues.user.dataValues.username;
        delete message.dataValues.user;
        message.dataValues.roomname = message.dataValues.room.dataValues.roomname;
        delete message.dataValues.room;

        return message.dataValues;
      });
      console.log('Sequelizeed messages..................', messagesTransformed);
      
      cb(messagesTransformed);
    })
    .catch( (err) => {
      console.log('ERR when sequelizing messages......', err);
    });
};




// exports.getAllMessages({}, (messages)=> {
//   console.log('***** MESSAGES: ', messages);
// });


