const express = require('express');
const router = express.Router();

const { isLoggedIn, isAdmin } = require('../middleware');

const User = require('../models/user.model');
const Orders = require('../models/orders.model');

router
	.route('/dashboard')
	.get(isLoggedIn, isAdmin, async (req, res) => {
		const allOrders = await Orders.find({})
			.sort('-1')
			.populate('products')
			.populate('orderedBy')
			.populate('deliveredBy');

		const deliveryPerson = await User.find({ role: 'delivery-man' });
		res.render('admin-dashboard', { allOrders, deliveryPerson });
	})
	.post(isLoggedIn, isAdmin,async (req, res) => {
		console.log(req.body.deliveryPerson);
		const deliveryPersonId = req.body.deliveryPerson.split(' ')[0];
		const orderId = req.body.deliveryPerson.split(' ')[1];
		const order = await Orders.findByIdAndUpdate(orderId, {
			$set: { deliveredBy: deliveryPersonId }
		});
		req.flash('success', 'Order assigned successfully.');
		res.redirect('/dashboard');
	});

module.exports = router;
