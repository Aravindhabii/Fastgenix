const express = require('express');
const router = express.Router();
const random = require('random');

const { isLoggedIn } = require('../middleware');

const User = require('../models/user.model');
const Products = require('../models/products.model');
const Orders = require('../models/orders.model');

router
	.route('/cart')
	.get(isLoggedIn, async (req, res) => {
		const user = await User.findById(req.user._id).populate('carts');
		res.render('cart', { user });
	})
	.post(isLoggedIn, async (req, res) => {
		const addedProduct = await Products.findById(req.body._id);
		const user = await User.findById(req.user._id);
		for (let cart of user.carts) {
			if (cart == addedProduct._id.toString()) {
				req.flash(
					'error',
					'Product already found in cart. Visit cart to checkout.'
				);
				res.redirect('/');
				return;
			}
		}
		await user.carts.push(addedProduct);
		await user.save();
		req.flash('success', 'Product added to cart');
		res.redirect('/cart');
	});

router.post('/remove-item', async (req, res) => {
	const user = await User.findByIdAndUpdate(req.user._id.toString(), {
		$pull: { carts: req.body.id }
	});
	res.redirect('/cart');
});

router.post('/checkout', async (req, res) => {
	const user = await User.findById(req.user._id).populate('carts');
	const users = await User.find({ role: 'delivery-man' });

	const orders = await new Orders({
		products: user.carts,
		quantity: user.carts.length,
		orderedBy: user._id,
	});
	orders.save();
	res.redirect('/orders');
});

router.get('/orders', isLoggedIn, async (req, res) => {
	const orders = await Orders.find({ orderedBy: req.user._id })
	.populate('products')
	.populate('orderedBy')
	.populate('deliveredBy');
	const order = orders[orders.length-1]
	res.render('orders', { order });
});

module.exports = router;
