const { ObjectId } = require('bson');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
	products: [
		{
			type: ObjectId,
			ref: 'Products',
			required: true
		}
	],
	quantity: {
		type: Number,
		default: 1,
		required: true,
		min: 1
	},
	orderedBy: {
		type: ObjectId,
		ref: 'User',
		required: true
	},
	deliveredBy: {
		type: ObjectId,
		ref: 'User',
		default: 'Not Assigned'
	},
	orderState: {
		type: String,
		enum: [
			'Task Created',
			'Reached Store',
			'Items Picked',
			'Enroute',
			'Delivered',
			'Canceled'
		],
		default: 'Task Created'
	}
});

module.exports = mongoose.model('Orders', OrderSchema);
