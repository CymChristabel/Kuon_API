/**
 * NCE_task.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	tableName: 'NCE_task',

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
    	nextLession: {
    		columnName: 'nextLessionID',
    		type: 'integer',
    		required: true,
    		model: 'nce_lession'
    	},
    	startDate: {
    		type: 'string',
    		required: true
    	},
        finished: {
            type: 'boolean',
            defaultsTo: false
        }
    }
};

