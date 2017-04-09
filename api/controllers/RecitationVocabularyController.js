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
					res.serverError(err);
				}
				return res.json(word);
			});
		}
		else
		{
			RecitationVocabulary.findOne({ id: id }).populate('word').exec(function (err, word) {
				if (err) {
					return res.serverError(err);
				}
				RecitationProgress.findOne({ user: req.param('userID'), vocabulary: id, deletedAt: null }).exec((finalErr, finalResult) => {
					if(finalErr)
					{
						return res.serverError(finalErr);
					}
					if(finalResult == undefined)
					{
						RecitationProgress.create({ user: req.param('userID'), vocabulary: id, time: 0 , progress: 0 }).exec((createErr, createResult) => {
							if(finalErr)
							{
								console.log(finalErr);
								return res.serverError(finalErr);
							}
							return res.json({ word: word, progress: createResult });
						});
					}
					else
					{
						return res.json({ word: word, progress: finalResult });
					}
				});
			});
		}
	}
};

