var moment = require('moment');
var async = require('async');

module.exports = {
	find(req, res){
		if(req.param('vocabularyID'))
		{
			RecitationStatistics.find({ user: req.param('userID'), vocabulary: req.param('vocabularyID'), deletedAt: null } )
			.sort('date ASC')
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
		else
		{
			RecitationStatistics.find({ user: req.param('userID'), deletedAt: null })
			.sort('date ASC')
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
		RecitationStatistics.findOne({ user: req.param('userID'), date: req.param('date'), vocabulary: req.param('vocabularyID'), deletedAt: null }).exec((err, result) => {
			if(err)
			{
				console.log(err);
				return res.serverError(err);
			}
			if(result)
			{
				RecitationStatistics.update({ id: result.id }, { correct: req.param('correct') + result.correct, incorrect: req.param('incorrect') + result.incorrect }).exec((finalErr, finalResult) => {
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
				
				RecitationStatistics.create({ user: req.param('userID'), date: req.param('date'), deletedAt: null, vocabulary: req.param('vocabularyID'), correct: req.param('correct'), incorrect: req.param('incorrect') }).exec((finalErr, finalResult) => {
					if(finalErr)
					{
						console.log(finalErr);
						return res.serverError(finalErr);
					}
					return res.ok();
				});
			}
		});
	},
	synchronize: (req, res) => {
		let userID = req.param('userID');
		let data = req.param('data');
		let date = [], correct = [], incorrect = [], vocabularyID = [];
		for(let i = 0; i < data.length; i++)
		{
			date.push(data[i].date);
			vocabularyID.push(data[i].vocabularyID);
			correct.push(data[i].correct)
			incorrect.push(data[i].incorrect)
		}
		RecitationStatistics.find({ user: userID, date: date, vocabulary: vocabularyID })
		.sort('date ASC')
		.exec((err, result) => {
			if(err)
			{
				console.log(err);
				return res.serverError(err);
			}
			let createList = [];
			let updateList = { id: [], correct: [], incorrect: [] };			
			for(let i = 0; i < date.length; i++)
			{
				let flag = false;
				for(let j = 0; j < result.length; j++)
				{
					if(date[i] == result[j].date && vocabularyID[i] == result[j].vocabulary)
					{
						updateList.id.push(result[j].id);
						updateList.correct.push(result[j].correct + correct[i]);
						updateList.incorrect.push(result[j].incorrect + incorrect[i]);
						flag = true;
						break;
					}
				}
				if(!flag)
				{
					createList.push({
						date: date[i],
						correct: correct[i],
						incorrect: incorrect[i],
						vocabulary: vocabularyID[i],
						user: userID
					});
				}
			}
			let task = [];
			for(let i = 0; i < updateList.id.length; i++)
			{
				task.push((callback) => {
					RecitationStatistics.update({ id: updateList.id[i] }, { correct: updateList.correct[i], incorrect: updateList.incorrect[i] }).exec((err, result) => {
						if(err){
							callback(err, null);
						}
						callback(null, result);
					});
				});
			}
			if(createList.length > 0)
			{
				task.push((callback) => {
					RecitationStatistics.create(createList).exec((err, result) => {
						if(err){
							callback(err, null);
						}
						callback(null, result);
					});
				});
			}
			async.series(task, (err, ok) => {
				if(err){
					console.log(err);
					return res.serverError(err);
				}
				RecitationStatistics.find({ user: userID })
				.sort('date ASC')
				.exec((finalErr, finalResult) => {
					if(finalErr){
						console.log(finalErr);
						return res.serverError(finalErr);
					}
					return res.json(finalResult);
				});
			});
		});
	}
};

