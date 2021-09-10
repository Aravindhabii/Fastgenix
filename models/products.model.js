const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductsSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	category: {
		type: String,
		required: true
	},
	image: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	addresses: {
		type: Array,
		required: true
	}
});

module.exports = mongoose.model('Products', ProductsSchema);
