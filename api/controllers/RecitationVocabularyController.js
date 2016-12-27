/**
 * Recitation_listController
 *
 * @description :: Server-side logic for managing recitation_lists
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find(req, res){
		var id = req.param('id');
		var result;

		if(id == null)
		{
			RecitationVocabulary.find().exec(function (err, word) {
				if (err) {
					return res.json({err: err});
				}
				return res.json(word);
			});
		}
		else
		{
			RecitationVocabulary.find({ id: id }).populate('word').exec(function (err, word) {
				if (err) {
					return res.json({err: err});
				}
				return res.json(word);
			});
		}
	}
};

