/**
 * FriendController
 *
 * @description :: Server-side logic for managing friends
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var async = require('async');
var _ = require('lodash');
var moment = require('moment');

module.exports = {
	searchUser: (req, res) => {
		let userID = req.param('userID');
		let key = req.param('key');
		User.find({ or: [{ email: { 'contains' : key } }, { nickname: { 'contains' : key } }], id: { '!': userID } }).exec((err, result) => {
			if(err)
			{
				return res.serverError(err);
			}
			for(let i = 0; i < result.length; i++)
			{
				result[i] = _.omit(result[i], ['createdAt', 'updatedAt', 'deletedAt']);
			}
			return res.json(result);
		});
	},

	getRequest: (req, res) => {
		FriendRequest.find({ responseUser: req.param('userID'), deletedAt: null }).populate('requestUser').exec((err, result) => {
			if(err)
			{
				return res.serverError(err);
			}
			for(let i = 0; i < result.length; i++)
			{
				result[i] = result[i].requestUser;
				result[i] = _.omit(result[i], ['createdAt', 'updatedAt', 'deletedAt']);
			}
			return res.json(result);
		});
	},

	resolveRequest: (req, res) => {
		let requestUserID = req.param('requestUserID');
		let responseUserID = req.param('userID');
		FriendRequest.update({ requestUser: requestUserID, responseUser: responseUserID }, { deletedAt: moment().format('YYYY-MM-DD HH:mm:ss') }).exec((err, ok) => {
			if(err)
			{
				return res.serverError(err);
			}
			async.series([
			(callback) => {
				Friendship.update({ userA: requestUserID, userB: responseUserID }, { deletedAt: null }).exec((err, result) => {
					if(err)
					{
						callback(err, null);
					}
					if(result.length == 0)
					{
						callback(null, false);
					}
					else
					{
						callback(null, true);
					}
				});
			},
			(callback) => {
				Friendship.update({ userA: responseUserID, userB: requestUserID }, { deletedAt: null }).exec((err, result) => {
					if(err)
					{
						callback(err, null);
					}
					if(result.length == 0)
					{
						callback(null, false);
					}
					else
					{
						callback(null, true);
					}
				});
			}], (updateErr, updateResult) => {
				if(updateErr)
				{	
					return res.serverError(updateErr);
				}
				if(!updateResult[0] && !updateResult[1])
				{
					Friendship.create({ userA: requestUserID, userB: responseUserID }).exec((createErr, ok) => {
						if(createErr)
						{
							return res.serverError(createErr);
						}
						async.series([
							(cb) => {
								Friendship.find({ userA: req.param('userID'), deletedAt: null }).populate('userB').exec((err, result) => {
									if(err)
									{
										cb(err, null);
									}
									let friend = [];
									for(let i = 0; i < result.length; i++)
									{
										friend.push(_.omit(result[i].userB, ['createdAt', 'updatedAt', 'deletedAt']));
									}
									cb(null, friend);
								});
							},
							(cb) => {
								Friendship.find({ userB: req.param('userID'), deletedAt: null }).populate('userA').exec((err, result) => {
									if(err)
									{
										cb(err, null);
									}
									let friend = [];
									for(let i = 0; i < result.length; i++)
									{
										friend.push(_.omit(result[i].userA, ['createdAt', 'updatedAt', 'deletedAt']));
									}
									cb(null, friend);
								});
							}], (finalErr, finalResult) => {
								if(finalErr)
								{
									return res.serverError(finalErr);
								}
								let temp = finalResult[0].concat(finalResult[1]);
								return res.json(temp);
							});
						});
				}
				else
				{
					async.series([
						(cb) => {
							Friendship.find({ userA: req.param('userID'), deletedAt: null }).populate('userB').exec((err, result) => {
								if(err)
								{
									cb(err, null);
								}
								let friend = [];
								for(let i = 0; i < result.length; i++)
								{
									friend.push(_.omit(result[i].userB, ['createdAt', 'updatedAt', 'deletedAt']));
								}
								cb(null, friend);
							});
						},
						(cb) => {
							Friendship.find({ userB: req.param('userID'), deletedAt: null }).populate('userA').exec((err, result) => {
								if(err)
								{
									cb(err, null);
								}
								let friend = [];
								for(let i = 0; i < result.length; i++)
								{
									friend.push(_.omit(result[i].userA, ['createdAt', 'updatedAt', 'deletedAt']));
								}
								cb(null, friend);
							});
						}], (finalErr, finalResult) => {
							if(finalErr)
							{
								return res.serverError(finalErr);
							}
							let temp = finalResult[0].concat(finalResult[1]);
							return res.json(temp);
						});
				}
			});
		});
	},

	rejectRequest: (req, res) => {
		let responseUserID = req.param('userID');
		let requestUserID = req.param('requestUserID');
		FriendRequest.update({ requestUser: requestUserID, responseUser: responseUserID }, { deletedAt: moment().format('YYYY-MM-DD HH:mm:ss') }).exec((err, ok) => {
			if(err)
			{
				return res.serverError(err);
			}
			return res.ok();
		});
	},

	postRequest: (req, res) => {
		let requestUserID = req.param('userID');
		let responseUserID = req.param('responseUserID');
		async.series([
			(callback) => {
				Friendship.findOne({ userA: requestUserID, userB: responseUserID, deletedAt: null }).exec((err, result) => {
					if(err)
					{
						callback(err, null);
					}
					if(result)
					{
						callback(null, false);
					}
					else
					{
						callback(null, true);
					}
				});
			},
			(callback) => {
				Friendship.findOne({ userA: responseUserID, userB: requestUserID, deletedAt: null }).exec((err, result) => {
					if(err)
					{
						callback(err, null);
					}
					if(result)
					{
						callback(null, false);
					}
					else
					{
						callback(null, true);
					}
				});
			}], (err, result) => {
				if(err)
				{
					return res.serverError(err);
				}
				if(result[0] && result[1])
				{
					FriendRequest.update({ requestUser: requestUserID, responseUser: responseUserID }, { deletedAt: null }).exec((err, result) => {
						if(err)
						{
							return res.serverError(err);
						}
						if(result.length == 0)
						{
							FriendRequest.create({ requestUser: requestUserID, responseUser: responseUserID }).exec((createErr, ok) => {
								if(createErr)
								{
									return res.serverError(err);
								}
								return res.json({ ok: true });
							});
						}
						else
						{
							return res.json({ ok: true });
						}
					});
				}
				else
				{
					return res.json({ ok: false, message: 'already friend' });
				}
			});
	},

	getFriend: (req, res) => {
		let requestUserID = req.param('userID');
		async.series([
			(callback) => {
				Friendship.find({ userA: requestUserID, deletedAt: null }).populate('userB').exec((err, result) => {
					if(err)
					{
						callback(err, null);
					}
					let friend = [];
					for(let i = 0; i < result.length; i++)
					{
						friend.push(_.omit(result[i].userB, ['createdAt', 'updatedAt', 'deletedAt']));
					}
					callback(null, friend);
				});
			},
			(callback) => {
				Friendship.find({ userB: requestUserID, deletedAt: null }).populate('userA').exec((err, result) => {
					if(err)
					{
						callback(err, null);
					}
					let friend = [];
					for(let i = 0; i < result.length; i++)
					{
						friend.push(_.omit(result[i].userA, ['createdAt', 'updatedAt', 'deletedAt']));
					}
					callback(null, friend);
				});
			}], (err, result) => {
				if(err)
				{
					return res.serverError(err);
				}
				let temp = result[0].concat(result[1]);
				return res.json(temp);
			});
	},

	sayGoodbye: (req, res) => {
		let requestUserID = req.param('userID');
		let friendID = req.param('friendID');
		async.series([
			(callback) => {
				Friendship.update({ userA: requestUserID, userB: friendID, deletedAt: null }, { deletedAt: moment().format('YYYY-MM-DD HH:mm:ss') }).exec((err, result) => {
					if(err)
					{
						callback(err, null);
					}
					callback(null, true);
				});
			},
			(callback) => {
				Friendship.update({ userA: friendID, userB: requestUserID, deletedAt: null }, { deletedAt: moment().format('YYYY-MM-DD HH:mm:ss') }).exec((err, result) => {
					if(err)
					{
						callback(err, null);
					}
					callback(null, true);
				});
			}], (err, result) => {
				if(err)
				{
					return res.serverError(err);
				}
				return res.ok();
			});
	}
};

