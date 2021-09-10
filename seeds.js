const mongoose = require('mongoose');

const Products = require('./models/products.model');

mongoose
	.connect('mongodb://localhost:27017/Fastgenix')
	.then(() => {
		console.log('DATABASE CONNECTED');
	})
	.catch((err) => {
		console.log(err);
	});

const products = [
	{
		name: 'Chips',
		category: 'Foods and Beverages',
		image:
			'https://previews.123rf.com/images/cheserstockphoto/cheserstockphoto2006/cheserstockphoto200600047/148369035-image-of-sliced-potato-chips-bunch-of-crisps-closeup-background-.jpg',
		description: 'Tasty snack to fill your tummy!',
		addresses: ['24x7 Sector 54 ,Gurgaon', 'Big Bazaar, Sector 25, Gurgaon']
	},
	{
		name: 'Disprin',
		category: 'Pharmacy',
		image:
			'https://cdn.shopify.com/s/files/1/0055/0338/5715/products/extra-strength-medipharm.jpg?v=1613586289',
		description:
			'Treat many conditions such as headache, toothache, muscle pain, and fever.',
		addresses: [
			'Apollo Medicine, Sector 63, Gurgaon',
			'Apollo Medicine, Sector 22, Gurgaon'
		]
	}
];

const base = async () => {

	Products && await Products.deleteMany({});
	products.forEach(async (product) => {
		const data = await new Products(product);
		await data.save();
		console.log(data);
	});
};

base();
