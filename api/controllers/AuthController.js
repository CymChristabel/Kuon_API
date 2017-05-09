/**
 * AuthController
 * @description :: Server-side logic for manage user's authorization
 */
// var MailerService = require('sails-service-mailer');
var passport = require('passport');
var moment = require('moment');

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

  requestForgetPassword: (req, res) => {
    let email = req.param('email');
    User.findOne({ email: email, deletedAt: null }).exec((err, result) => {
      if (err) {
        return res.serverError(err);
      }
      if (result) {
        ForgetPasswordToken.find({ deletedAt: null }).exec((findErr, findResult) => {
          if(findErr)
          {
            return res.serverError(findErr);
          }
          let token = Math.round(Math.random() * 1000000);
          if(findResult.length > 0)
          {
            let flag = true;
            while(flag)
            {
              token = Math.round(Math.random() * 1000000);
              for(let i = 0; i < findResult.length; i++)
              {
                if(findResult[i].token == token)
                {
                  break;
                }
                if(i == findResult.length - 1)
                {
                  flag = false;
                }
              }
            }
          }
          ForgetPasswordToken.create({ user: result.id, token: token }).exec((createErr, ok) => {
            if (createErr) 
            {
              return res.serverError(createErr);
            }
            MailerService.mailer.send({
              to: email,
              text: 'token:' + token
            })
            .then(res.json({ ok: true, message: 'email sended'}))
            .catch(res.negotiate);
          });
        });
      }
      else {
        return res.json({ ok: false, message: 'This email does not exist' });
      }
    });
  },

  resolveForgetPassword: (req, res) => {
    let token = req.param('token');
    let password = req.param('password');
    ForgetPasswordToken.findOne({ token: token, deletedAt: null}).exec((err, result) => {
      if(err)
      {
        return res.serverError(err);
      }
      if(result)
      {
        if(moment().diff(moment(result.createdAt), 'minutes') < 60)
        {
          ForgetPasswordToken.update({ id: result.id }, { deletedAt: moment().format('YYYY-MM-DD HH:mm:ss') }).exec((finalErr, ok) => {
            if(finalErr)
            {
              return res.serverError(finalErr);
            }
          });
          User.update({ id: result.user }, { password: password }).exec((finalErr, ok) => {
            if(finalErr)
            {
              return res.serverError(finalErr);
            }
            return res.json({ ok: true });
          });
        }
        else
        {
          ForgetPasswordToken.update({ id: result.id }, { deletedAt: moment().format('YYYY-MM-DD HH:mm:ss') }).exec((finalErr, ok) => {
            if(finalErr)
            {
              return res.serverError(finalErr);
            }
            return res.json({ ok: false, message: 'token expired' });
          });
        }
      }
      else
      {
        return res.json({ ok: false, message: 'token not found' });
      }
    });
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