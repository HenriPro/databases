var db = require('../db');
var dBHelper = require('../helpers/dBHelper.js');

module.exports = {
  messages: {
    get: function (req, cb) {
      dBHelper.getAllMessages(req, cb);
    }, // a function which produces all the messages
    post: function (obj, cb) {
      dBHelper.buildMessage(obj, cb);
    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function () {
      dBHelper.users.get(obj.username, cb);
    },
    post: function (obj, cb) {
      dBHelper.buildField(obj, 'users', 'username', cb);
    }
  },

  rooms: {
    // Ditto as above.
    get: function () {
      // dBHelper.users.get(obj.username, cb);
    },
    post: function (obj, cb) {
      dBHelper.buildField(obj, 'rooms', 'roomname', cb);
    }
  }
};

