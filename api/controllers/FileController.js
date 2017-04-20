/**
 * TestController
 *
 * @description :: Server-side logic for managing tests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {
	getFile: (req, res) => {
		return res.sendfile('views/template.png');
	},
	getAudio: (req, res) => {
		return res.sendfile(req.param('audio'));
	},
	uploadFile: (req, res) => {
		req.file('avatar').upload(function (err, uploadedFiles){
		if (err) return res.serverError(err);
			return res.json({
				message: files.length + ' file(s) uploaded successfully!',
				files: files
			});
		});
	}
};

