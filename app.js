
// - - - - - - - - - - - - - - //
//   D E P E N D E N C I E S   //
// - - - - - - - - - - - - - - //

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var engine = require('ejs-locals');
var cookieParser = require('cookie-parser');
var mongo = require('mongodb');
var app = express();


// - - - - - - - - - - - - - - - //
//   C O N F I G U R A T I O N   //
// - - - - - - - - - - - - - - - //

app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());﻿
app.use(cookieParser());

var mongoUri = process.env.MONGOLAB_URI ||
  				process.env.MONGOHQ_URL || 
  				'mongodb://localhost/mydb';

var ObjectId = require('mongodb').ObjectID;

app.use(express.static(path.join(__dirname, 'bower_components'))); 
app.use(express.static(path.join(__dirname, 'public')));


// - - - - - - - - //
//   R O U T E S   //
// - - - - - - - - //

// Static Pages
app.get('/', function (req, res) {
	res.render('index');
});

app.get('/whatWeEat', function (req, res) {
	res.render('whatWeEat');
});

app.get('/communityMap', function (req, res) {
	res.render('communityMap');
});

app.get('/studentProjs', function (req, res) {
	res.render('studentProjs');
});
app.get('/submit', function (req, res) {
	res.render('submit');
});

// Data Submission
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

			if (student == null || hypothesis == null ||
				student == "" || hypothesis == "") {
				res.send("Missing Fields!");
			} else {
				col.find({'student':student}).toArray(function(err, items){
					if (items.length != 0) {
						res.send("You've already submitted a hypothesis!");
					} else {
						col.insert({'student':student, 'hypothesis':hypothesis}, function(err, items) {
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
			var student = req.body.name;
			var location_name = req.body.location_name;
			var location_address = req.body.location_address;
			var location_type = req.body.location_type;
			var location_neighborhood = req.body.location_neighborhood;
			
			if (student == null || location_name == null || 
				location_address == null || location_type == null || location_neighborhood == null || 
				student == "" || location_name == "" || 
				location_address == "" || location_type == "") {
				res.send("Missing Fields!");
			} else {
				col.find({'student':student}).toArray(function(err, items){
					col.insert({'student':student, 'location_name':location_name, 
								'location_address':location_address, 'location_type':location_type}, function(err, items) {
						res.redirect('communityMap');
					});
				});
			}
		});
	});
});

// Data Retrieval
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

app.get('/hypothesis', function(req, res, next) {
	mongo.Db.connect(mongoUri, function(err, db) {
		db.collection('TIU_submissions', function(err, col) {
			var hyp_data = " ";
			col.find().toArray(function(err, items) {
				if (!err) {
					hyp_data = "<!DOCTYPE HTML><html><head><title>This Is Us</title><link rel='stylesheet' href='bootstrap/dist/css/bootstrap.css'><link rel='stylesheet' href='css/style.css'><script src='jquery/dist/jquery.js'></script><script src='bootstrap/dist/js/bootstrap.js'></script><link rel='SHORTCUT ICON' href='images/tree_favicon.gif' type='image/x-icon'/><link rel='ICON' href='images/tree_favicon.gif' type='image/ico'/></head>";
					hyp_data += "<body><div><div id='nav'>";
					hyp_data += "<ul id='nav_links'><li><a href='/'>THIS IS US</a></li><li>|</li><li><a href='hypothesis'>Student Hypotheses</a></li><li><a href='whatWeEat'>What We Eat</a></li><li><a href='communityMap'>Community Mapping</a></li><li><a href='studentProjs'>Student Projects</a></li><li><a href='submit'>Submit Data</a></li>";
					hyp_data += "</ul></div><h1>Student Hypotheses</h1><div class='info'>";	
					for (var count = items.length - 1; count >= 0; count--) {
						hyp_data += "<h4>Student: " + items[count].student + "</h4>" +
									"<p>" + items[count].hypothesis + "</p><br>";
					}
					hyp_data += "</div></div></body>";
				res.send(hyp_data);
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
	console.log("Listening in port " + port);
});


