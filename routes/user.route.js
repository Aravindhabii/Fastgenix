const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn } = require('../middleware');

const User = require('../models/user.model');

router
	.route('/register')
	.get((req, res) => {
		res.render('auth/register');
	})
	.post(async (req, res) => {
		try {
			const { phoneNumber, password, username } = req.body;
			const user = await new User({ phoneNumber, username });
			const registeredUser = await User.register(user, password);
			req.login(registeredUser, (err) => {
				if (err) return;
				res.redirect('/');
			});
		} catch (err) {
			console.log(err);
			req.flash('error', 'Some error occured.');
			res.redirect('/register');
		}
	});

router
	.route('/login')
	.get((req, res) => {
		res.render('auth/login');
	})
	.post(
		passport.authenticate('local', {
			failureFlash: true,
			failureRedirect: '/login'
		}),
		(req, res) => {
			const redirectUrl = req.session.returnTo || '/';
			delete req.session.returnTo;
			res.redirect(redirectUrl);
		}
	);

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

module.exports = router;
