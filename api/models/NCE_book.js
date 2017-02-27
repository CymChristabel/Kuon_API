/**
 * NCE_book.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	tableName: 'NCE_book',

	attributes: {
	  	title:{
	  		type: 'string'
	  	},
	  	description: {
	  		type: 'string'
	  	},
	  	lession: {
			collection: 'nce_lession',
			via: 'book'
		}
  }
};

