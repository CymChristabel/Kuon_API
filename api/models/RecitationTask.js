/**
 * RecitationTask.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	tableName: 'recitation_task',
	attributes: {
		user: {
			columnName: 'userID',
			type: 'integer',
			required: true,
			model: 'user'
    	},
    	vocabulary: {
    		columnName: 'vocabularyID',
    		type:'integer',
    		required: true,
    		model: 'recitationvocabulary'
    	},
    	startDate: {
			type: 'string',
			required: true
		},
		goal: {
			type: 'integer',
			required: true
		},
        finished: {
            type: 'boolean'
        },
        current: {
        	type: 'integer',
        	defaultsTo: 0
        }
	}
};

