const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
	phoneNumber: {
		type: Number,
		required: true,
		unique: true
	},
	username: {
		type: String,
		required: true
	},
	role: {
		type: String,
		default: 'subscriber'
	},
	carts: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Products',
			default: null
		}
	]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
