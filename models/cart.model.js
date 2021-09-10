const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const cartSchema = new mongoose.Schema(
	{
		products: [
			{
				product: {
					type: ObjectId,
					ref: 'Products'
				},
				count: { type: Number, default: 1 },
				price: Number
			}
		],
		cartTotal: Number,
		orderedBy: { type: ObjectId, ref: 'User' }
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);
