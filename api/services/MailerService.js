var MailerService = require('sails-service-mailer');

module.exports = {
	mailer: MailerService('direct', {
		from: 'no-reply@NCEApp.com',
		subject: 'This is a test email',
		provider: {
			path: '/usr/sbin/sendmail'
		}
	})
}