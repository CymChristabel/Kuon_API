/**
 * Recitation_word.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	tableName: 'recitation_word',
	attributes: {
		list: {
			columnName: 'listID',
			type: 'integer',
			required: true,
			model: 'recitationlist'
		},
		name: {
			type: 'string'
		},
		explainnation: {
			columnName: 'explainnations',
			type: 'string'
		}
	}
};
