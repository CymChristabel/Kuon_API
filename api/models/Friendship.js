/**
 * Friendship.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	tableName: 'friendship',

	attributes: {
		userA: {
			columnName: 'userAID',
			type: 'integer',
			required: true,
			model: 'user'
    	},
    	userB: {
			columnName: 'userBID',
			type: 'integer',
			required: true,
			model: 'user'
    	}
	}
};

