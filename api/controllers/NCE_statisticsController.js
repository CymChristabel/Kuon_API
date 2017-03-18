/**
 * NCEStatisticsController
 *
 * @description :: Server-side logic for managing Ncestatistics
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find(req, res){
		var userID = req.param('user');

		NCE_statistics.find({user: userID}).populate('lession', { select: ['title'] }).exec(function (err, result){
				if(err){
					return res.err(err);
				}
				return res.json(result);
			});
	}
};

