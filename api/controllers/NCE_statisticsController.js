var moment = require('moment');
var _ = require('lodash');
var async = require('async');

module.exports = {
	find(req, res){
		if(req.param('lessionID'))
		{
			NCE_statistics.find({ user: req.param('userID'), lession: req.param('lessionID'), deletedAt: null })
				.sort('date ASC')
				.exec((err, result) => {
					if(err){
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
			NCE_statistics.find({ user: req.param('userID'), deletedAt: null })
				.sort('book ASC')
				.exec((err, result) => {
					if(err){
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
	create(req, res){
		NCE_statistics.create({ user: req.param('userID'), date: req.param('date'), correct: req.param('correct'), incorrect: req.param('incorrect'), book: req.param('bookID'), lession: req.param('lessionID') }).exec((finalErr, finalResult) => {
			if(finalErr)
			{
				console.log(finalErr);
				return res.serverError(finalErr);
			}
			return res.json(_.omit(finalResult, ['createdAt', 'updatedAt', 'deletedAt']));
		});
	},
	synchronize: (req, res) => {
		let userID = req.param('userID');
		let data = _.sortBy(req.param('data'), ['lessionID', 'createdAt']);
		for(let i = 0; i < data.length; i++)
		{
			let temp = {
				user: userID,
				date: data[i].date,
				correct: data[i].correct,
				incorrect: data[i].incorrect,
				book: data[i].bookID,
				lession: data[i].lessionID
			}
		}
		NCE_statistics.create(temp).exec((err, ok) => {
			if(err)
			{
				console.log(err);
				return res.serverError(err);
			}
			NCE_statistics.find({ user: userID, deletedAt: null })
			.sort('book ASC')
			.exec((finalErr, finalResult) => {
				if(finalErr)
				{
					console.log(finalErr);
					return res.serverError(finalErr);
				}
				console.log(finalResult);
				return res.json(_.omit(finalResult, ['createdAt', 'updatedAt', 'deletedAt']));
			})
		});
	}
};



