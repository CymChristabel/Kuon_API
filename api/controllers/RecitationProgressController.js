/**
 * RecitationProgressController
 *
 * @description :: Server-side logic for managing Recitationprogresses
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find(req, res){
		if(req.param('vocabularyID'))
		{
			RecitationProgress.findOne({ user: req.param('userID'), vocabulary: req.param('vocabularyID'), deletedAt: null })
				.sort('vocabulary ASC')
				.exec((err, result) => {
					if(err)
					{
						console.log(err);
						return res.serverError(err);
					}
					result = _.omit(result, ['createdAt', 'updatedAt', 'deletedAt']);
					return res.json(result);
				});
		}
		else
		{
			RecitationProgress.find({ user: req.param('userID'), deletedAt: null })
				.sort('vocabulary ASC')
				.exec((err, result) => {
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
		RecitationProgress.findOne({ user: req.param('userID'), vocabulary: req.param('vocabularyID'), deletedAt: null }).exec((err, result) => {
			if(err)
			{
				console.log(err);
				return res.serverError(err);
			}
			if(result)
			{
				RecitationProgress.update({ id: result.id }, { progress: req.param('progress'), time: req.param('time') }).exec((finalErr, finalResult) => {
					if(finalErr)
					{
						console.log(finalErr);
						return res.serverError(finalErr);
					}
					return res.ok();
				});
			}
			else
			{
				RecitationProgress.create({ user: req.param('userID'), vocabulary: req.param('vocabularyID'), time: req.param('time') , progress: req.param('progress') }).exec((finalErr, finalResult) => {
					if(finalErr)
					{
						console.log(finalErr);
						return res.serverError(finalErr);
					}
					return res.ok();
				});
			}
		});
	}
};

