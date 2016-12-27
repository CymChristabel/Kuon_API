/**
 * Recitation_list.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	tableName: 'recitation_vocabulary',
	attributes: {
		name: {
			type: 'string'
		},
		word: {
			collection: 'recitationword',
			via: 'list'
		},
		cover: {
			type: 'string'
		},
		description: {
			type: 'string'
		}
	}

};

