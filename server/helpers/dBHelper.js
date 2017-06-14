var mysql = require('mysql');
const Sequelize = require('sequelize');
const db = new Sequelize('chat', 'root', 'plantlife');

// exports.dbConnection = () => { 
//   return mysql.createConnection({
//     user: 'root',
//     password: 'plantlife',
//     database: 'chat'
//   });
// };

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

// exports.buildField = (obj, tableName, fieldName, cb) => {

//   var connection = exports.dbConnection();
//   connection.connect();
  
//   var insertString = `INSERT INTO ${tableName} (${fieldName}) VALUES ("${obj[tableName]}");`;
//   var insertArgs = [];
//   console.log('INSERTING ', insertString);
//   connection.query(insertString, insertArgs, function(err, results) {
//     if (err) {
//       console.log('Error inserting into ', tableName, fieldName, err);
//       cb(err);
//     } else {
//       console.log('Successfully inserted into ', tableName, fieldName, results);
//       cb(results);
//     }
//     connection.end();
//   });

// };
  

exports.buildMessage = (obj, cb) => {

  var message = {text: obj.text};
  db.sync()
  .then( () => {  
    return exports.getUserIdPromise(obj.username);
  })
  .then( (user) => {
    console.log('GOT USER: ', user.id);
    message.userID = user.id;
  })
  .then( () => {
    return exports.getRoomIdPromise(obj.roomname);
  })
  .then( (room) => {
    console.log('GOT ROOM: ', room.id);
    message.roomID = room.id;
  })
  .then( () => {
    return Messages.create(message);
  })
  .catch(function(err) {
    // Handle any error in the chain
    console.error(err);
    db.close();
  })
  .then( () => {
    cb();
    db.close();
  });


};

exports.getUserIdPromise = (name) => {
  return Users.find( { where: [ {username: name} ]});
};

exports.getRoomIdPromise = (room) => {
  return Rooms.find( { where: [ {roomname: room} ]});
};


var counter = 0;

exports.getAllMessages = (req, cb) => {
  counter++;
// console.log('COUNTER: ', counter);
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
      
      // db.close(); //WHY DOES IT DO THIS
    
      cb(messagesTransformed);
    })
    .catch( (err) => {
      db.close();
      console.log('ERR when sequelizing messages......', err);
    });
};




// exports.buildMessage({username: 'batman', roomname: 'lobby', text: 'well hello'}, () => {console.log('success')} );

