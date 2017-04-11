/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	changeNickname: (req, res) => {
		User.update({ email: req.param('email'), deletedAt: null }, { nickname: req.param('nickname') }).exec((err, result) => {
			if(err)
			{
				return res.serverError(err);
			}
			return res.json(result[0]);
		});
	},

	getUserDetail: (req, res) => {
		User.findOne({ email: req.param('email'), deletedAt: null }).exec((err, result) => {
			if(err)
			{
				return res.serverError(err);
			}
			return res.json(result);
		});
	}

};

