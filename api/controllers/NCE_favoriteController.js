var _ = require('lodash');
var moment = require('moment');

module.exports = {
	//if user has network problem during add/delete favorite
	synchronize: (req, res) => {
		let list = req.param('favoriteList');
		let data = [];

		for(let i = 0; i < list.length; i++)
		{
			data.push({
				user: req.param('userID'),
				book: list[i].bookID,
				lession: list[i].lessionID
			});
		}

		NCE_favorite.update({ user: req.param('userID') }, { deletedAt: moment().format('YYYY-MM-DD HH:mm:ss')}).exec((updateErr, data) => {
			if(updateErr)
			{
				console.log(updateErr);
				return res.serverError(updateErr);
			}
			NCE_favorite.findOrCreate(data).exec((fcErr, result) => {
				if(fcErr)
				{
					console.log(fcErr);
					return res.serverError(fcErr);
				}
				let idList = [];
				for(let i = 0; i < result.length; i++)
				{
					idList.push(result[i].id);
				}
				NCE_favorite.update({ id: idList }, {deletedAt: null}).exec((finalErr, finalResult) => {
					if(finalErr)
					{
						console.log(finalErr);
						return res.serverError(finalErr);
					}
					return res.ok();
				});
			});
		});
	},

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
				result[i].lession = _.pick(result[i].lession, 'title');
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

