/**
 * Friend_request.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	tableName: 'friend_request',

	attributes: {
		requestUser: {
			columnName: 'requestUserID',
			type: 'integer',
			required: true,
			model: 'user'
    	},
    	responseUser: {
			columnName: 'responseUserID',
			type: 'integer',
			required: true,
			model: 'user'
    	}
	}
};

