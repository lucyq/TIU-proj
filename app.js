// TODO: view instr classes



// - - - - - - - - - - - - - - //
//   D E P E N D E N C I E S   //
// - - - - - - - - - - - - - - //

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var engine = require('ejs-locals');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session'); // creates in memory store
var mongo = require('mongodb');
var passport = require('passport');
var passportLocal = require('passport-local');
var passportHttp = require('passport-http');
var crypto = require('crypto');

var app = express();

// - - - - - - - - - - - - - - - //
//   C O N F I G U R A T I O N   //
// - - - - - - - - - - - - - - - //

app.engine('ejs', engine);
app.set('view engine', 'ejs');



app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());﻿
app.use(cookieParser());

app.use(expressSession({ secret: process.env.SESSION_SECRET || "butterflies",
						 resave: false, saveUninitialized: false})); // butterflies can be anything


// enable CORS

var mongoUri = process.env.MONGOLAB_URI ||
  				process.env.MONGOHQ_URL || 
  				'mongodb://localhost/mydb';

var ObjectId = require('mongodb').ObjectID;

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});



app.use(passport.initialize());
app.use(passport.session()); // want to maintain session


function verifyCredentials(username, password, done) {
	mongo.Db.connect(mongoUri, function(err, db) {
		db.collection('TIU_users', function(err, collection) {
			if (username == null || password == null || username == "" || password == "") {
				done(err,null);
			} else {
				collection.find({'username':username}).toArray(function(err, items){
					if (items.length == 0) {
						done(null, false, {message: 'Incorrect username'});
					} else {
						if (items[0].password == crypto.createHash('md5').update(password).digest("hex")) {
							return done(null, {id: username, name: username});
						} else {
							done(null, false, {message: 'Incorrect password'});
						}
					}
				});
			}
		});
	});
}

// passport.use('authByType', new typeStrategy({
// 	var account = new Account();
// 	account.
// }));


passport.use(new passportLocal.Strategy(verifyCredentials));
passport.use(new passportHttp.BasicStrategy(verifyCredentials));


passport.serializeUser(function(user, done){
	// would query database usually
	done(null, user); // first arg is error
	// console.log("USER: " + user);
}); 


passport.deserializeUser(function(user, done) {
	done(null, user);
	// console.log("USER:"  + user);
});

function ensureAuthorized(req, res, next) {
	if(req.isAuthenticated()) {
		next();
	} else {
		res.sendStatus(403);
		//res.redirect('/login'); // not logged in, can't get api/data!
	}
}

// - - - - - - - - - - - //
//   R E S O U R C E S   //
// - - - - - - - - - - - //

app.use(express.static(path.join(__dirname, 'bower_components'))); 
app.use(express.static(path.join(__dirname, 'public')));





// - - - - - - - - //
//   R O U T E S   //
// - - - - - - - - //

// ACCOUNT MANAGEMENT

// NOTE: google failure flash req.flash is a thing :O
app.post('/login', passport.authenticate('local', { 
	failureRedirect: '/error',
	successRedirect: '/landing'
}));

app.post('/create_account', function(req, res, next){
	mongo.Db.connect(mongoUri, function (err,db){
		db.collection('TIU_users', function(err, col) {
			var username = req.body.username;

			var password = req.body.password;
			var full_name = req.body.full_name;
			var ver_password = req.body.confirm_password;
			var ver_code = req.body.ver_code;

			var class_id = req.body.dropdown_class_list;
			var email = req.body.email;
			var time = new Date();
			var class_list = [];

			if (username.substring(0,5) == "instr_") {
				role = "instr";
			} else {
				role = "student";
				class_list.push(class_id);
			}

     		// if (username == null || password == null || ver_password == null || email == null || 
     		// 	first_name == null || last_name == null || phone_num == null) {
     		// 	res.send('Missing fields!');
     		// } else if (password != ver_password){
     		if (password != ver_password) {
     			res.send("Passwords don't match!");
     		} else {
     			col.find({'username':username}).toArray(function(err, items) {
     				if (items.length != 0) {
     					res.send("Username has been taken!");
     				} else {
     					col.insert({'username':username,
     								'password':crypto.createHash('md5').update(password).digest("hex"),
     								'full_name': full_name,
     								'email':email,
     								'class_list':class_list,
     								'role': role,
     								'created_at':time
			     					}, {safe: true}, function(err, res) {
			     						col.find({'username':username}).toArray(function(err, items) {
			     							// TODO: what do i put here?
			     						});
     					});
   						res.redirect("/");
     				}
     			});
     		}
		});
	});
  
});



app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});


// STATIC PAGES
app.get('/error', function (req, res) {
	res.render('error', {
		isAuthenticated: req.isAuthenticated(),
		user: req.user
	});
});


app.get('/', function (req, res) {
	res.render('index', {
		isAuthenticated: req.isAuthenticated(),
		user: req.user
	});
});

app.get('/about', function (req, res) {
	res.render('about', {
		isAuthenticated: req.isAuthenticated(),
		user: req.user
	});
});

app.get('/whatWeEat', function (req, res) {
	res.render('whatWeEat', {
		isAuthenticated: req.isAuthenticated(),
		user: req.user
	});
});

app.get('/communityMap', function (req, res) {
	res.render('communityMap', {
		isAuthenticated: req.isAuthenticated(),
		user: req.user
	});
});

app.get('/hypothesis', function (req, res) {
	res.render('hypothesis', {
		isAuthenticated: req.isAuthenticated(),
		user: req.user
	});
});

app.get('/studentProjs', function (req, res) {
	res.render('studentProjs', {
		isAuthenticated: req.isAuthenticated(),
		user: req.user
	});
});

app.get('/submit', function (req, res) {
	res.render('submit', {
		isAuthenticated: req.isAuthenticated(),
		user: req.user
	});
});

app.get('/viewInstr_classes', function(req, res) {
	if (req.user.id.substring(0,5) == "instr") {
		res.render('viewInstr_classes', {
			isAuthenticated: req.isAuthenticated(),
			user: req.user
		});
	} else {
		res.send(401).send("Permission Denied. Must be an instructor");
	}
});

app.get('/viewClasses', function (req, res) {
	res.render('viewClasses', {
		isAuthenticated: req.isAuthenticated(),
		user: req.user
	});
});


app.get('/manageClasses', function (req, res) {
	res.render('manageClasses', {
		isAuthenticated: req.isAuthenticated(),
		user: req.user
	});
});





app.get('/landing', function(req, res) {
	usrname = req.user.id;
	prefix = usrname.substring(0,3);

	if (prefix == 'instr') {		
		res.render('instr_landing', {
			isAuthenticated: req.isAuthenticated(), 
			user: req.user
		});

	} else {
		res.render('landing', {
			isAuthenticated: req.isAuthenticated(), 
			user: req.user
		});
	}
});



app.get('/create_instructor', function(req, res) {
	// console.log("Curr user: " + req.user);
	if (req.user.id == "admin") {
		res.render('create_instructor');
	} else {
		res.status(401).send("Permission denied. Must be an admin!");
	}
});



app.get('/view_user_data', function (req, res) {
	res.render('view_user_data', {
		isAuthenticated: req.isAuthenticated(),
		//user: req.user
		user: req.user
	});
});

// DATA SUBMISSION
app.post("/add_new_class", function(req, res, next){
	var instructor = req.body.instructor_name;
			var class_name = req.body.class_name;
			var school = req.body.school_name;
			var code = req.body.ver_code;


	mongo.Db.connect(mongoUri, function(err, db) {
		if (err) {
			res.send("Error connecting to database!");
		}

		db.collection('TIU_users', function(err, col) {
			if(err) {
				res.send("Database error");
			}

			col.find({'username':instructor}).toArray(function(err, items) {

				// TODO:
				console.log("LIST: " + items.class_list);
				items.class_list.push(class_name);


			});
		});


		db.collection('TIU_classes', function(err, col) {
			if (err) {
				res.send("Database Error!");
			}
			

			if (instructor == null || school == null || class_name == null || code == null ||
				instructor == "" || school == "" || class_name == "" || code == "") {
				res.send("Missing Fields!");
			} else {
				// ADD HASHING TO CODE
				col.insert({'instructor':instructor, 'school':school, 'class_name':class_name, 'validation_code':code}, function(err, items) {
					res.redirect('/manageClasses');
				});		
			}
		});
	});
});



app.post("/submit_hypothesis", function(req, res, next) {
	mongo.Db.connect(mongoUri, function(err, db) {
		if (err) {
			res.send("Error connecting to database!");
		}
		db.collection('TIU_submissions', function(err, col) {
			if (err) {
				res.send("Database Error!");
			}
			var student = req.body.student_name;
			var hypothesis = req.body.hypothesis;
			var time = new Date();

			if (student == null || hypothesis == null ||
				student == "" || hypothesis == "") {
				res.send("Missing Fields!");
			} else {
				col.find({'student':student}).toArray(function(err, items){
					if (items.length != 0) {
						res.send("You've already submitted a hypothesis!");
					} else {
						col.insert({'student':student, 'hypothesis':hypothesis, 'created_at':time}, function(err, items) {
							res.redirect('hypothesis');
						});		
					}
				});
			}
		});
	});
});

app.post("/submit_location", function(req, res, next) {
	mongo.Db.connect(mongoUri, function(err, db) {
		if (err) {
			res.send("Error connecting to database!");
		}
		db.collection('TIU_locations', function(err, col) {
			if (err) {
				res.send("Database Error!");
			}
			var student = req.body.student;
			var location_name = req.body.location_name;
			var location_address = req.body.location_address;
			var location_type = req.body.location_type;
			var location_neighborhood = req.body.location_neighborhood;
			var lat = req.body.lat;
			var lng = req.body.lng;


			if (student == null || location_name == null || 
				location_address == null || location_type == null ||
				student == "" || location_name == "" || 
				location_address == "" || location_type == "") {
				res.send("Missing Fields!");
			} else {
				col.find({'student':student}).toArray(function(err, items){
					col.insert({'student':student, 'location_name':location_name, 
								'location_address':location_address, 'location_type':location_type, 'location_neighborhood':location_neighborhood, 'lat':lat, 'lng':lng}, function(err, items) {
						//res.redirect('communityMap');
						res.send("success");
					});
				});
			}
		});
	});
});

// DATA RETRIEVAL
app.get('/location_data', function (req, res, next) {
	mongo.Db.connect(mongoUri, function(err, db) {
		db.collection('TIU_locations', function(err, col){
			if (!err) {
				col.find().toArray(function(err, items) {
					res.send(items);
				});
			}
		});
	});
});

// retrieves all classes
app.get('/class_data', function(req, res, next) {
	mongo.Db.connect(mongoUri, function(err, db) {
		db.collection('TIU_classes', function(err, col){
			if (!err) {
				col.find().toArray(function(err, items) {
					res.send(items);
				});
			}
		});
	});
});

app.get('/instr_classes', function(req, res, next) {

	var instr_name = req.query.instr;

	mongo.Db.connect(mongoUri, function (err, db) {
		db.collection('TIU_users', function(err, col) {
			if (!err) {
				col.find({"username": instr_name}).toArray(function(err, items) {
					res.send(items['class_list']);

				});
			}
		});

	});
});


app.get('/location_data_byClass', function(request, response) {
	// enable cross origin sharing
	response.header("Access-Control-Allow-Origin", "*");
  	response.header("Access-Control-Allow-Headers", "X-Requested-With");

  	// get username
  	var username = request.query.username;

  	var class_ID; // get class ID from username
  	if (class_ID === undefined) {
  		response.send('[]');
  	}
  	else {
  		// connect database
		mongo.Db.connect(mongoUri, function (err, db) {
			db.collection("TIU_locations", function (err, col) {
				// find information
				col.find({"class_ID": class_ID}).toArray(function (err, items) {
					if (!err) {
						response.send(items);
					}
				});
			});
		});
	}
});



app.get('/hyp_data', function(req, res, next) {
	mongo.Db.connect(mongoUri, function(err, db) {
		db.collection('TIU_submissions', function(err, col) {
			//var hyp_data = " ";
			col.find().toArray(function(err, items) {
				if (!err) {
					res.send(items);
				}
			});
		});
	});
});


// - - - - - - - - //
//   S E R V E R   //
// - - - - - - - - //

var port = process.env.PORT || 5000;

app.listen(port, function() {
	console.log("Listening in on port " + port);
});


