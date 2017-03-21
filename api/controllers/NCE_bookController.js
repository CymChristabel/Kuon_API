/**
 * NCE_bookController
 *
 * @description :: Server-side logic for managing Nce_books
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find(req, res){
		var id = req.param('id');

		if(id == null)
		{
			NCE_book.find().populate('lession').exec(function (err, result){
				if(err){
					return res.serverError(err);
				}
				return res.json(result);
			});
		}
		else
		{
			NCE_book.find({id: req.param('id')}).populate('lession').exec(function (err, result){
				if(err){
					return res.serverError(err);
				}
				return res.json(result);
			});
		}
	}
};

