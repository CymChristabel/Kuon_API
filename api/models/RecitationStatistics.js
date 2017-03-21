/**
 * RecitationStatistics.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	tableName: 'recitation_statistics',
	attributes: {
		user: {
			columnName: 'userID',
			type: 'integer',
			required: true,
			model: 'user'
    	},
		date: {
			type: 'string',
			required: true
		},
		correct: {
			type: 'integer',
			defaultsTo: 0
		},
		incorrect: {
			type: 'integer',
			defaultsTo: 0
		},
	}
};

