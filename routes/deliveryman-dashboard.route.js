const express = require('express');
const router = express.Router();

const { isDeliveryMan, isLoggedIn } = require('../middleware');

const Orders = require('../models/orders.model');

router
  .route("/delivery-dashboard")
  .get(isLoggedIn, isDeliveryMan, async (req, res) => {
    const assignedOrders = await Orders.find({ deliveredBy: req.user._id })
      .populate("products")
      .populate("orderedBy");

    res.render("deliveryman-dashboard", { assignedOrders });
  })
  .post(isLoggedIn, isDeliveryMan, async (req, res) => {
	  const status = req.body.deliveryStatus.split('#')[0];
	  const orderId = req.body.deliveryStatus.split('#')[1];
	  const orderStatusUpdate = await Orders.findOneAndUpdate(orderId, {
      $set: { orderState: status },
    });
		console.log(orderStatusUpdate);
    req.flash("success", "Delivery status successfull updated.");
    res.redirect("/delivery-dashboard");
  });

module.exports = router;
