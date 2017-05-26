var express = require("express"),
	mongoose = require("mongoose"),
	bodyParser = require("body-parser"),
	hbs = require("hbs"),
	bcrypt = require("bcrypt-nodejs"),
	localAuth = require("./auth"),
	User = require("./user"),
	session = require("express-session"),
	passport = require("passport"),
	app = express();

	app.set("view engine", "hbs");
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
	extended: true	
}));

	app.use(session({
		secret: 'itsASecret',
		resave: true,
		saveUninitialized: true
	}));

	app.use(passport.initialize());
	app.use(passport.session());

	localAuth(passport);

	app.get("/", function(req, res){
		res.render("index");
	});

	app.get("/login", function(req, res){
		res.render("login");
	});

	app.get("/signup", function(req, res){
		res.render("signup");
	});

	app.post("/login", passport.authenticate("local-login", {
		successRedirect: "/user",
		failureRedirect: "/login"
	}));

	//creating a new user; passing username and passworrd; encrypting password; saving info to database
	app.post("/signup", function(req, res){
		new User({
			username: req.body.username,
			password: bcrypt.hashSync(req.body.password),
		}).save(function(err){
			if(err){
				console.log(err);
			} else {
				res.redirect("/login");
			}
		});
	});

	// user route, requsting user information from passport
	app.get("/user", function(req, res){
		res.render("user", {
			user: req.user
		}); 
	});


	mongooose.connect("mongodb://localhost/user");

	// localhost/8080

	app.listen(8080);
	console.log("server is running");
	