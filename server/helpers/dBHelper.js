var mysql = require('mysql');
const Sequelize = require('sequelize');
var newDBConnection = () => { return new Sequelize('chat', 'root', 'plantlife')};

var db = newDBConnection();
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


var TableMappings = {
  rooms: Rooms,
  users: Users
};

var FieldMappings = {
  rooms: 'roomname',
  users: 'username'
};

//Relationships
Messages.belongsTo(Users, {foreignKey: 'userID', targetKey: 'id'});
Users.hasMany(Messages, {foreignKey: 'userID'});

Messages.belongsTo(Rooms, {foreignKey: 'roomID', targetKey: 'id'});
Rooms.hasMany(Messages, {foreignKey: 'roomID'});


exports.buildField = (obj, tablename,cb) => {
  db = newDBConnection();
  db.sync()
    .then( () => {
   
      return TableMappings[tablename].create({ [FieldMappings[tablename]] : obj[tablename]});
    })
    .then( (tablerow) => {
      db.close();
      cb();
    })
    .catch( (err) => {
      console.log('error creating a table row for: ', tablename,  err);
      db.close();
    });
};


exports.buildMessage = (obj, cb) => {

  var message = {text: obj.text};
  db = newDBConnection();
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
    //db.close();
  })
  .then( () => {
    db.close();
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
  db = newDBConnection();
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

        message.dataValues.objectId = message.dataValues.id;
        delete message.dataValues.id;        

        return message.dataValues;
      });
      console.log('Sequelizeed messages..................', messagesTransformed);
      
      db.close(); 
      cb(messagesTransformed);
    })
    .catch( (err) => {
      db.close();
      console.log('ERR when sequelizing messages......', err);
    });
};





// exports.buildMessage({username: 'batman', roomname: 'lobby', text: 'well hello'}, () => {console.log('success')} );

