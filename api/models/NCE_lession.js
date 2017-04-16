/**
 * NCE_lession.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	tableName: 'NCE_lession',

	attributes: {
		engText: {
			type: 'string'
		},
		chnText: {
			type: 'string'
		},
		title: {
			type: 'string'
		},
		word: {
			type: 'string'
		},
		book: {
			columnName: 'bookID',
			type: 'integer',
			required: true,
			model: 'nce_book'
		},
		audio: {
			type: 'string'
		}
	}
};

