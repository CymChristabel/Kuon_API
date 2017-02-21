/**
 * AuthController
 * @description :: Server-side logic for manage user's authorization
 */
// var MailerService = require('sails-service-mailer');
var passport = require('passport');

function _onPassportAuth(req, res, error, user, info) {
  if (error) return res.serverError(error);
  if (!user) return res.unauthorized(null, info && info.code, info && info.message);
 
  return res.ok({
    token: CipherService.createToken(user),
    user: user
  });
}

module.exports = {

  signup: function (req, res) {
    User.findOne({ email: req.param('email') }).exec(function(err, id){
      if(id != null)
      {
        return res.json({error: 'already exist', token: -1});      //-1 stands for account already exist
      }
      else
      {
        User.create(_.omit(req.allParams(), 'id'))
        .then(function (user) {
            return {
              // TODO: replace with new type of cipher service
              token: CipherService.createToken(user),
              user: user
            };
        })
        .then(res.created)
        .catch(res.serverError);
      }
    });
  },
 
  login: function (req, res) {
    passport.authenticate('local', 
      _onPassportAuth.bind(this, req, res))(req, res);
  },

  send: function(req, res){
    MailerService.mailer.send({
      to: req.param('to'),
      text: 'and of course, beer'
    })
    .then(res.ok)
    .catch(res.negotiate);
  }
};