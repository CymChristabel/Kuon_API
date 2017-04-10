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
        return res.json({error: 'email already used', token: -1});      //-1 stands for account already exist
      }
      else
      {
        //remove id params in case database corrupt
        User.create(_.omit(req.allParams(), 'id'))
        .then(function (user) {
            return {
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
  },

  resetPassword: (req, res) => {
    User.findOne({ email: req.param('email') }).exec((err, user) => {
      if(err || !user)
      {
        return res.serverError('User not found');
      }
      if(CipherService.comparePassword(req.param('oldPassword'), user))
      {
        User.update({ id: user.id }, { password: req.param('newPassword') }).exec((finalErr, ok) => {
          if(finalErr)
          {
            return res.serverError(finalErr);
          }
          return res.json({ err: false, message: 'change succeed'});
        });
      }
      else
      {
        return res.json({ err: true, message: 'old password incorrect' });
      }
    });
  },

  testAuth(req, res){
    return res.json({ code: 'Accepted'});
  }
};