if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const express = require('express');
const fs = require('fs');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');

const User = require('./models/user.model');
const Products = require('./models/products.model');

const app = express();

let db_url = "";
if (process.env.NODE_ENV !== "production") {
  db_url = "mongodb://localhost:27017/Fastgenix";
} else {
  db_url = process.env.DB_URL;
}
mongoose
  .connect(db_url)
  .then(() => {
    console.log("DATABASE CONNECTED");
  })
  .catch((err) => {
    console.log(err);
  });


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(flash());

const sessionConfig = {
	secret: 'thisshouldbeabettersecret!',
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7
	}
};

app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	if (req.user) {
		res.locals.cartLength = req.user.carts.length;
	}
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

app.get('/', async (req, res) => {
	const products = await Products.find({});
	res.render('home', { products });
});

fs.readdirSync('./routes').map((route) =>
	app.use('/', require(`./routes/${route}`))
);

app.listen(process.env.PORT, () =>
	console.log(`SERVER IS RUNNING ON PORT ${process.env.PORT}`)
);
