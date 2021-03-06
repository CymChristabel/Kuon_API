/**
 * Study_time_statistics.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	tableName: 'study_time_statistics',

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
		nceTime: {
			type: 'integer',
			required: true,
			defaultsTo: 0
		},
		recitationTime: {
			type: 'integer',
			required: true,
			defaultsTo: 0
		}
	}
};

