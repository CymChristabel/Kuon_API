var async = require('async');
var moment = require('moment');
var _ = require('lodash');

module.exports = {
	getTask: (req, res) => {
		let userID = req.param('userID');
		async.series({
			nceTask: (finalCallback) => {
				NCE_task.find({ user: userID, finished: false,  deletedAt: null })
				.populate('book')
				.populate('nextLession')
				.exec((err, finalResult) => {
					if(err)
					{
						finalCallback(err, null);
					}
					for(let i = 0; i < finalResult.length; i++)
					{
						finalResult[i].book = _.pick(finalResult[i].book, ['id', 'title']);
						finalResult[i].nextLession = _.pick(finalResult[i].nextLession, ['id', 'title']);
						finalResult[i] = _.omit(finalResult[i], ['deletedAt']);
					}
					finalCallback(null, finalResult);
				});
			},
			recitationTask: (finalCallback) => {
				RecitationTask.find({ user: userID, finished: false, deletedAt: null })
				.populate('vocabulary')
				.exec((err, result) => {
					if(err)
					{
						finalCallback(err, null);
					}
					let resetID = [];
					for(let i = 0; i < result.length; i++)
					{
						result[i].vocabulary = _.pick(result[i].vocabulary, ['id', 'title']);
						result[i] = _.omit(result[i], ['deletedAt']);
						if(moment(result[i].updatedAt).format('YYYY-MM-DD') != moment().format('YYYY-MM-DD'))
						{
							resetID.push(result[i].id);
							result[i].current = 0;
						}
					}
					RecitationTask.update({ id: resetID }, { current: 0 }).exec((finalErr, ok) => {
						if(finalErr)
						{
							finalCallback(err, null);
						}
					});
					finalCallback(null, result);
				});
			}
		}, (finalErr, finalResult) => {
			if(finalErr)
			{
				return res.serverError(finalErr);
			}
			return res.json(finalResult);
		});
	},

	createNCETask: (req, res) => {
		NCE_task.findOne({ user: req.param('userID'), book: req.param('bookID'), finished: false, deletedAt: null }).exec((err, result) => {
			if(err)
			{
				console.log(err);
				return res.serverError(err);
			}
			if(result)
			{
				NCE_task.update({ id: result.id }, { nextLession: req.param('lessionID'), startDate: req.param('startDate') }).exec((finalErr, finalResult) => {
					if(finalErr)
					{
						console.log(finalErr);
						return res.serverError(finalErr);
					}
					return res.ok();
				})
			}
			else
			{
				NCE_task.create({ user: req.param('userID'), book: req.param('bookID'), nextLession: req.param('lessionID'), startDate: req.param('startDate') }).exec((finalErr, finalResult) => {
					if(finalErr)
					{
						console.log(finalErr);
						return res.serverError(finalErr);
					}
					return res.ok();
				})
			}
		});
	},

	updateNCETask: (req, res) => {
		let finished = req.param('finished');
		if(finished)
		{
			NCE_task.update({ user: req.param('userID'), book: req.param('bookID'), deletedAt: null }, { finished: true }).exec((err, result) => {
				if(err)
				{
					console.log(err);
					return res.serverError(err);
				}
				return res.ok();
			});
		}
		else
		{
			NCE_task.update({ user: req.param('userID'), book: req.param('bookID'), deletedAt: null }, { nextLession: req.param('lessionID') }).exec((err, result) => {
				if(err)
				{
					console.log(err);
					return res.serverError(err);
				}
				return res.ok();
			});
		}
	},

	deleteNCETask: (req, res) => {
		NCE_task.update({ user: req.param('userID'), book: req.param('bookID'), deletedAt: null }, { deletedAt: moment().format('YYYY-MM-DD HH:mm:ss') }).exec((err, result) => {
			if(err)
			{
				console.log(err);
				return res.serverError(err);
			}
			return res.ok();
		})
	},

	createRecitationTask: (req, res) => {
		RecitationTask.findOne({ user: req.param('userID'), vocabulary: req.param('vocabularyID'), finished: false, deletedAt: null }).exec((err, result) => {
			if(err)
			{
				console.log(err);
				return res.serverError(err);
			}
			if(result)
			{
				RecitationTask.update({ id: result.id }, { goal: req.param('goal') }).exec((finalErr, finalResult) => {
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
				RecitationTask.create({ user: req.param('userID'), vocabulary: req.param('vocabularyID'), goal: req.param('goal'), startDate: req.param('startDate') }).exec((finalErr, finalResult) => {
					if(finalErr)
					{
						return res.serverError(finalErr);
					}
					return res.ok();
				});
			}
		});
	},

	updateRecitationTask: (req, res) => {
		RecitationTask.update({ user: req.param('userID'), vocabulary: req.param('vocabularyID'), deletedAt: null }, { current: req.param('current') }).exec((err, result) => {
			if(err)
			{
				console.log(err);
				return res.serverError(err);
			}
			return res.ok();
		})
	},

	deleteRecitationTask: (req, res) => {
		RecitationTask.update({ user: req.param('userID'), vocabulary: req.param('vocabularyID'), deletedAt: null }, { deletedAt: moment().format('YYYY-MM-DD HH:mm:ss') }).exec((err, result) => {
			if(err)
			{
				console.log(err);
				return res.serverError(err);
			}
			return res.ok();
		})
	},

	synchronize: (req, res) => {
		let nceTask = req.param('nceTask');
		let recitationTask = req.param('recitationTask');
		let userID = req.param('userID');

		let createdNCE = [];
		let nceData = { bookID: [], lessionID: [], startDate: [], createdAt: [] };

		for(let i = 0; i < nceTask.length; i++)
		{
			if(!nceTask[i].deleted)
			{
				createdNCE.push({ user: userID, book: nceTask[i].bookID, nextLession: nceTask[i].lessionID, startDate: nceTask[i].startDate });
			}
			nceData.bookID.push(nceTask[i].bookID);
			nceData.lessionID.push(nceTask[i].lessionID);
			nceData.startDate.push(nceTask[i].startDate);
			nceData.createdAt.push(nceTask[i].createdAt);
		}

		async.series({
			nce: (callback) => {
				if(nceData.bookID.length > 0)
				{
					let deletedTask = [];
					for(let i = 0; i < nceData.bookID.length; i++)
					{
						deletedTask.push((cb) => {
							NCE_task.update({ user: userID, book: nceData.bookID[i], finished: false, createdAt: { '<': nceData.createdAt[i] }, deletedAt: null }, { deletedAt: moment().format('YYYY-MM-DD HH:mm:ss') }).exec((err, result) => {
								if(err)
								{
									cb(err, null);
								}
								cb(null, result);
							});
						});
					}
					async.series(deletedTask, (err, result) => {
						if(err)
						{
							callback(err, null);
						}
						if(createdNCE.length > 0)
						{
							let tempBookID = [];
							for(let i = 0; i < createdNCE.length; i++)
							{
								tempBookID.push(createdNCE[i].book);
							}
							NCE_task.find({ user: userID, book: tempBookID, finished: false, deletedAt: null }).exec((err, finalResult) => {
								if(err)
								{
									callback(err);
								}
								for(let i = 0; i < createdNCE.length; i++)
								{
									for(let j = 0; j < finalResult.length; j++)
									{
										if(createdNCE[i].book == finalResult[j].book)
										{
											createdNCE.splice(i, 1);
											break;
										}
									}
								}
								if(createdNCE.length > 0)
								{
									NCE_task.create(createdNCE).exec((finalErr, nceResult) => {
										if(finalErr)
										{
											callback(finalErr, null);
										}
										callback(null, nceResult);
									});
								}
								else
								{
									callback(null, nceResult);
								}
							});
						}
						else
						{
							callback(null, result);
						}
					});
				}
				else
				{
					callback(null, true);
				}
			},
			recitation: (callback) => {
				if(recitationTask.length > 0)
				{
					let asyncTask = [];
					for(let i = 0; i < recitationTask.length; i++)
					{
						if(recitationTask[i].deleted)
						{
							asyncTask.push((cb) => {
								RecitationTask.update({ user: userID, vocabulary: recitationTask[i].vocabularyID, createdAt: { '<': recitationTask[i].createdAt }, deletedAt: null }, { deletedAt: moment().format('YYYY-MM-DD') }).exec((err, result) => {
									if(err)
									{
										cb(err, null);
									}
									cb(null, result);
								});
							});
						}
						else
						{
							asyncTask.push((cb) => {
								RecitationTask.findOne({ user: userID, vocabulary: recitationTask[i].vocabularyID, deletedAt: null }).exec((err, result) => {
									if(err)
									{
										cb(err, null);
									}
									if(result && result.createdAt < recitationTask[i].createdAt)
									{
										RecitationTask.update({ id: result.id }, { goal: recitationTask[i].goal, current: recitationTask[i] }).exec((finalErr, finalResult) => {
											if(finalErr)
											{
												cb(finalErr, null);
											}
											cb(null, finalResult);
										});
									}
									else
									{
										RecitationTask.create({ user: userID, vocabulary: recitationTask[i].vocabularyID, startDate: recitationTask[i].startDate, goal: recitationTask[i].goal, current: recitationTask[i].current }).exec((finalErr, finalResult) => {
											if(finalErr)
											{
												cb(finalErr, null);
											}
											cb(null, finalResult);
										});
									}
								});
							});
						}
					}
					async.series(asyncTask, (err, ok) => {
						if(err)
						{
							callback(err, null);
						}
						callback(null, ok);
					});
				}
				else
				{
					callback(null, true);
				}
			}
		}, (err, ok) => {
			if(err)
			{
				return res.serverError(err);
			}
			async.series({
				nceTask: (finalCallback) => {
					NCE_task.find({ user: userID, finished: false,  deletedAt: null })
					.populate('book')
					.populate('nextLession')
					.exec((err, finalResult) => {
						if(err)
						{
							finalCallback(err, null);
						}
						for(let i = 0; i < finalResult.length; i++)
						{
							finalResult[i].book = _.pick(finalResult[i].book, ['id', 'title']);
							finalResult[i].nextLession = _.pick(finalResult[i].nextLession, ['id', 'title']);
							finalResult[i] = _.omit(finalResult[i], ['createdAt', 'deletedAt']);
						}
						finalCallback(null, finalResult);
					});
				},
				recitationTask: (finalCallback) => {
					RecitationTask.find({ user: userID, finished: false, deletedAt: null })
					.populate('vocabulary')
					.exec((err, finalResult) => {
						if(err)
						{
							finalCallback(err, null);
						}
						for(let i = 0; i < finalResult.length; i++)
						{
							finalResult[i].vocabulary = _.pick(finalResult[i].vocabulary, ['id', 'title']);
							finalResult[i] = _.omit(finalResult[i], ['createdAt', 'deletedAt']);
						}
						finalCallback(null, finalResult);
					});
				}
			}, (finalErr, finalResult) => {
				if(finalErr)
				{
					return res.serverError(finalErr);
				}
				return res.json(finalResult);
			});
		});
	}
};

