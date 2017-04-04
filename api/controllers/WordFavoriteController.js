var moment = require('moment');
var _ = require('lodash');

module.exports = {
	find(req, res){
		WordFavorite.find({ user: req.param('userID'), deletedAt: null })
		.populate('word')
		.exec((err, result) => {
			if(err)
			{
				console.log(err);
				return res.serverError(err);
			}
			for(let i = 0; i < result.length; i++)
			{
				result[i].word = _.pick(result[i].word, ['id', 'name']);
				result[i] = _.omit(result[i], ['createdAt', 'updatedAt', 'deletedAt']);
			}
			
			return res.json(result);
		})
	},

	add:(req, res) => {
		WordFavorite.find({ user: req.param('userID'), vocabulary: req.param('vocabularyID'), word: req.param('wordID') }).exec((findErr, result) => {
			if(findErr)
			{
				console.log(findErr);
				return res.serverError(findErr);
			}
			if(result.length == 0)
			{
				WordFavorite.create({ user: req.param('userID'), vocabulary: req.param('vocabularyID'), word: req.param('wordID') }).exec((finalErr, finalResult) => {
					if(finalErr)
					{
						console.log(finalErr);
						return res.serverError(finalErr);
					}
					if(Array.isArray(finalResult))
					{
						console.log(finalResult);
						return res.json(finalResult[0].id);
					}
					return res.json(finalResult.id);
				});
			}
			else
			{
				WordFavorite.update({ id: result[0].id }, { deletedAt: null }).exec((finalErr, finalResult) => {
					if(finalErr)
					{
						console.log(finalErr);
						return res.serverError(finalErr);
					}
					return res.json(finalResult[0].id);
				});
			}
		});
	},

	remove:(req, res) => {
		WordFavorite.update({ id: req.param('id') }, { deletedAt: moment().format('YYYY-MM-DD HH:mm:ss') }).exec((err, result) => {
			if(err)
			{
				console.log(err);
				return res.serverError(err);
			}
			return res.ok();
		});
	}
};

