var _ = require('lodash');
var moment = require('moment');

module.exports = {

	find(req, res){
		if(req.param('date'))
		{
			StudyTimeStatistics.find({ user: req.param('user'), date: req.param('date'), sort: 'date ASC' }).exec((err, result) => {
				if(err)
				{
					console.log(err);
					return res.serverError(err);
				}
				return res.json(_.omit(result, ['createdAt', 'updatedAt', 'deletedAt']));
			});
		}
		else
		{
			StudyTimeStatistics.find({ user: req.param('user'), sort: 'date ASC' }).exec((err, result) => {
				if(err)
				{
					console.log(err);
					return res.serverError(err);
				}
				return res.json(_.omit(result, ['createdAt', 'updatedAt', 'deletedAt']));
			});
		}
	},

	createOrUpdate(req, res){
		let data = req.param('data');
		console.log(data);
		StudyTimeStatistics.find({ user: data.user, date: data.date }).exec((err, result) =>{
			if(err){
				console.log(err);
				return res.serverError(err);
			}
			if(result.length == 0)
			{
				StudyTimeStatistics.create(data).exec((finalErr, finalResult) => {
					if(finalErr){
						console.log(finalErr);
						return res.serverError(finalErr);
					}
					return res.json(finalResult);
				});
			}
			else
			{
				if(req.param('hasSynchronized') == false)
				{
					data.nceTime = data.nceTime + result[0].nceTime;
					data.recitationTime = data.recitationTime + result[0].recitationTime;
				}
				StudyTimeStatistics.update({ user: data.user, date: data.date }, { nceTime: data.nceTime, recitationTime: data.recitationTime }).exec((finalErr, finalResult) => {
					if(finalErr){
						console.log(finalErr);
						return res.serverError(finalErr);
					}
					return res.json(finalResult);
				});
			}
		});
	},

	synchronize: (req, res) => {
		let temp = req.param('data');
		let userID = req.param('user');
		let data = [];

		for(let key in temp)
		{
			data.push({
				date: key,
				nceTime: temp[key].nceTime,
				recitationTime: temp[key].recitationTime,
				user: userID
			})
		}

		StudyTimeStatistics.findOrCreate(data).exec((err, result) => {
			if(err)
			{
				console.log(err);
				return res.serverError(err);
			}
			return res.json(result);
		})
	}
	
};

