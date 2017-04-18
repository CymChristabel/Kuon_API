/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var bcrypt = require('bcrypt');

module.exports = {
  schema: true,

  attributes: {
  	email: {
  		type: 'string',
      email: true,
      required: true,
      unique: true
  	},
  	password: {
  		type: 'string'
  	},
  	nickname: {
  		type: 'string',
      defaultsTo: 'John Doe'
  	},
  	avatar: {
  		type: 'string',
      defaultsTo: null
  	},
    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
  },
  beforeUpdate: function (values, next) {
    CipherService.hashPassword(values);
    next();
  },
  beforeCreate: function (values, next) {
    CipherService.hashPassword(values);
    next();
  }
};

