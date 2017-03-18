import * as _ from 'lodash';

module.exports = {

	find(req, res){
		if(req.param('date'))
		{
			StudyTimeStatistics.find({ user: req.param('user'), date: req.param('date') }).exec((err, result) => {
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
			StudyTimeStatistics.find({ user: req.param('user') }).exec((err, result) => {
				if(err)
				{
					console.log(err);
					return res.serverError(err);
				}
				return res.json(_.omit(result, ['createdAt', 'updatedAt', 'deletedAt']));
			});
		}
	},

	createOrUpdate: (req, res) => {
		StudyTimeStatistics.find({ user: req.param('user'), date: req.param('date') }).exec((err, result) => {
			if(err)
			{
				console.log(err);
				return res.serverError(err);
			}
			if(result.length == 0)
			{
				StudyTimeStatistics.create(req.allParams()).exec((err, data) => {
					if(err)
					{
						console.log(err);
						return res.serverError(err);
					}
					return res.json(_.omit(data, ['createdAt', 'updatedAt', 'deletedAt']));
				});
			}
			else
			{
				StudyTimeStatistics.update({ user: req.param('user'), date: req.param('date') }, { nceTime: req.param('nceTime'), recitationTime: req.param('recitationTime') }).exec((err, data) => {
					if(err)
					{
						console.log(err);
						return res.serverError(err);
					}
					return res.json(_.omit(data, ['createdAt', 'updatedAt', 'deletedAt']));
				})
			}
		})
	}
	
};

