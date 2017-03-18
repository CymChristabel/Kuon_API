/**
 * NCEStatistics.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	tableName: 'NCE_statistics',

	attributes: {
		user: {
			columnName: 'userID',
			type: 'integer',
			required: true,
			model: 'user'
    	},
    	book: {
    		columnName: 'bookID',
    		type: 'integer',
    		required: true,
    		model: 'nce_book'
    	},
    	lession: {
    		columnName: 'lessionID',
    		type: 'integer',
    		required: true,
    		model: 'nce_lession'
    	},
    	date: {
    		type: 'string',
    		required: true
    	},
    	time: {
    		type: 'integer'
    	},
    	correct: {
    		type: 'integer'
    	},
    	incorrect: {
    		type: 'integer'
    	}
	}
};

