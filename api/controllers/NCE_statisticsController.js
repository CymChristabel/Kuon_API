/**
 * NCEStatisticsController
 *
 * @description :: Server-side logic for managing Ncestatistics
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var _ = require('lodash');

module.exports = {
	find(req, res){
		var userID = req.param('user');

		NCE_statistics.find({ user: userID }, { where: { deletedAt: null }, sort: 'lessionID ASC' } ).populate('lession').populate('book').exec(function (err, result){
				if(err){
					return res.json(err);
				}
				for(let i = 0; i < result.length; i++)
				{
					result[i].lession = _.pick(result[i].lession, [ 'id', 'title' ]);
					result[i].book = _.pick(result[i].book, [ 'id', 'title' ]);
				}

				return res.ok(result);
			});
	}
};

