var _ = require('lodash');
var moment = require('moment');

module.exports = {

	find(req, res){
		NCE_favorite.find({ user: req.param('userID'), deletedAt: null })
		.populate('lession')
		.exec((err, result) => {
			if(err)
			{
				console.log(err);
				return res.serverError(err);
			}
			for(let i = 0; i < result.length; i++)
			{
				result[i].lession = _.pick(result[i].lession, ['id', 'title']);
				result[i] = _.omit(result[i], ['createdAt', 'updatedAt', 'deletedAt']);
			}
			
			return res.json(result);
		})
	},

	add: (req, res) => {
		NCE_favorite.find({ user: req.param('userID'), lession: req.param('lessionID'), book: req.param('bookID') }).exec((findErr, result) => {
			if(findErr)
			{
				console.log(findErr);
				return res.serverError(findErr);
			}
			if(result.length == 0)
			{
				NCE_favorite.create({ user: req.param('userID'), lession: req.param('lessionID'), book: req.param('bookID') }).exec((finalErr, finalResult) => {
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
				NCE_favorite.update({ id: result[0].id }, { deletedAt: null }).exec((finalErr, finalResult) => {
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

	remove: (req, res) => {
		NCE_favorite.update({ id: req.param('id') }, { deletedAt: moment().format('YYYY-MM-DD HH:mm:ss') }).exec((err, result) => {
			if(err)
			{
				console.log(err);
				return res.serverError(err);
			}
			return res.ok();
		});
	}
};

