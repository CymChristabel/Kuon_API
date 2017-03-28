/**
 * RecitationStatisticsController
 *
 * @description :: Server-side logic for managing Recitationstatistics
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find(req, res){
		if(req.param('vocabularyID'))
		{
			RecitationStatistics.find({ user: req.param('userID'), vocabulary: req.param('vocabularyID'), deletedAt: null } , { sort: 'date ASC' }).exec((err, result) => {
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
			RecitationStatistics.find({ user: req.param('userID'), deletedAt: null }, { sort: 'date ASC' }).exec((err, result) => {
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
	},
	createOrUpdate: (req, res) => {
		RecitationStatistics.find({ user: req.param('userID'), date: req.param('date'), vocabulary: req.param('vocabularyID'), deletedAt: null}).exec((err, result) => {
			if(err)
			{
				console.log(err);
				return res.serverError(err);
			}
			if(result.length == 0)
			{
				RecitationStatistics.create({ user: req.param('userID'), date: req.param('date'), deletedAt: null, vocabulary: req.param('vocabularyID'), correct: req.param('correct'), incorrect: req.param('incorrect') }).exec((finalErr, finalResult) => {
					if(finalErr)
					{
						console.log(finalErr);
						return res.serverError(finalErr);
					}
					return res.json(finalResult);
				});
			}
			else
			{
				RecitationStatistics.update({ user: req.param('userID'), date: req.param('date'), deletedAt: null, vocabulary: req.param('vocabularyID') }, { correct: req.param('correct') + result[0].correct, incorrect: req.param('incorrect') + result[0].incorrect }).exec((finalErr, finalResult) => {
					if(finalErr)
					{
						console.log(finalErr);
						return res.serverError(finalErr);
					}
					return res.json(finalResult);
				});
			}
		});
	}
};

