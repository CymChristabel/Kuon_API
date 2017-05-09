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
		console.log(req);
		req.file('avatar').upload({
			dirname: '../../assets/uploads'
		}, function (err, uploadedFiles){
			if (err) return res.serverError(err);
			return res.json({
				message: uploadedFiles.length + ' file(s) uploaded successfully!',
				files: uploadedFiles
			});
		});
	}
};

