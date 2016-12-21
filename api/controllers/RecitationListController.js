/**
 * Recitation_listController
 *
 * @description :: Server-side logic for managing recitation_lists
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function(req, res){
		var id = req.param('id');
		var result;

		if(id == null)
		{
			RecitationList.find().exec(function (err, word) {
				if (err) {
					return res.err(err);
				}
				return res.json(word);
			});
		}
		else
		{
			RecitationList.find({ id: req.param('id') }).populate('word').exec(function (err, word) {
				if (err) {
					return res.err(err);
				}
				return res.json(word);
			});
		}
	}
};

