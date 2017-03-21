/**
 * RecitationStatisticsController
 *
 * @description :: Server-side logic for managing Recitationstatistics
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find(req, res){
		if(req.param('date'))
		{
			RecitationStatistics.find({ user: req.param('user'), date: req.param('date'), deletedAt: null } , { sort: 'date ASC' }).exec((err, result) => {
				if(err)
				{
					console.log(err);
					return res.serverError(err);
				}
				for(let i = 0; i < result.length; i++)
				{
					result[i] = _.omit(result[i], ['createdAt', 'updatedAt', 'deletedAt']);
				}
				return res.json(result);
			});
		}
		else
		{
			RecitationStatistics.find({ user: req.param('user'), deletedAt: null }, { sort: 'date ASC' }).exec((err, result) => {
				if(err)
				{
					console.log(err);
					return res.serverError(err);
				}
				for(let i = 0; i < result.length; i++)
				{
					result[i] = _.omit(result[i], ['createdAt', 'updatedAt', 'deletedAt']);
				}
				return res.json(result);
			});
		}
	}
};

