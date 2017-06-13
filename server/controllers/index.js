var models = require('../models');

module.exports = {
  messages: {
    get: function (req, res) {
      console.log('inside messages controller GET');
      
    }, // a function which handles a get request for all messages
    post: function (req, res) {
      console.log('inside message controller POST');
      models.messages.post(req.body, () => {
        res.statusCode = 201;
        res.end();
      });
    } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {
      console.log('Inside users controllerGET');
    },
    post: function (req, res) {
      console.log('in post users controller', req.body);
      models.users.post(req.body, () => {
        res.statusCode = 201;
        res.end();
      });
      

    
    }
  }
};

