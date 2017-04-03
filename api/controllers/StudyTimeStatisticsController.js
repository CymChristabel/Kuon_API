var _ = require('lodash');
var moment = require('moment');
var async = require('async');

module.exports = {

	find(req, res){
		if(req.param('date'))
		{
			StudyTimeStatistics.find({ user: req.param('userID'), date: req.param('date'), deletedAt: null } , { sort: 'date ASC' }).exec((err, result) => {
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
			StudyTimeStatistics.find({ user: req.param('userID'), deletedAt: null }, { sort: 'date ASC' }).exec((err, result) => {
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
		let data = req.param('data');
		StudyTimeStatistics.findOne({ user: data.userID, date: data.date, deletedAt: null }).exec((err, result) =>{
			if(err){
				console.log(err);
				return res.serverError(err);
			}
			if(result)
			{
				StudyTimeStatistics.update({ id: result.id }, { nceTime: result.nceTime + data.nceTime, recitationTime: result.recitationTime + data.recitationTime }).exec((finalErr, finalResult) => {
					if(finalErr){
						console.log(finalErr);
						return res.serverError(finalErr);
					}
					return res.ok();
				});
			}
			else
			{
				StudyTimeStatistics.create({ user: data.userID, date: data.date, nceTime: data.nceTime, recitationTime: data.recitationTime }).exec((finalErr, finalResult) => {
					if(finalErr){
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
		let date = [], nceTime = [], recitationTime = [];

		for(let i = 0; i < data.length; i++)
		{
			date.push(data[i].date);
			nceTime.push(data[i].nceTime)
			recitationTime.push(data[i].recitationTime)
		}

		StudyTimeStatistics.find({ user: userID, date: date })
		.sort('date ASC')
		.exec((err, result) => {
			if(err)
			{
				console.log(err);
				return res.serverError(err);
			}
			let createList = [];
			let updateList = { id: [], nceTime: [], recitationTime: [] };

			let count = 0;
			for(let i = 0; i < date.length; i++)
			{
				let flag = false;
				for(let j = 0; j < result.length && count < result.length; j++)
				{
					if(date[i] == result[j].date)
					{
						updateList.id.push(result[j].id);
						updateList.nceTime.push(result[j].nceTime + nceTime[i]);
						updateList.recitationTime.push(result[j].recitationTime + recitationTime[i]);
						flag = true;
						count = count + 1;
						break;
					}
				}
				if(!flag)
				{
					createList.push({ user: userID, date: date[i], nceTime: nceTime[i], recitationTime: recitationTime[i] });
				}
			}
			let task = [];
			for(let i = 0; i < updateList.id.length; i++)
			{
				task.push((callback) => {
					StudyTimeStatistics.update({ id: updateList.id[i] }, { nceTime: updateList.nceTime[i], recitationTime: updateList.recitationTime[i] }).exec((err, result) => {
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
					StudyTimeStatistics.create(createList).exec((err, result) => {
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
				StudyTimeStatistics.find({ user: userID })
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

