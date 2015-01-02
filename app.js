var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var engine = require('ejs-locals');
var cookieParser = require('cookie-parser');
var mongo = require('mongodb');
var app = express();


app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());﻿
app.use(cookieParser());

var mongoUri = process.env.MONGOLAB_URI ||
  				process.env.MONGOHQ_URL || 
  				'mongodb://localhost/mydb';

var ObjectId = require('mongodb').ObjectID;


// app.all('*', function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });


app.use(express.static(path.join(__dirname, 'bower_components'))); 
app.use(express.static(path.join(__dirname, 'public')));


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
app.get('/hypothesis', function (req, res) {
	res.render('hypothesis');
});



// submitting data
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

app.get('/hyp_data.json', function(req, res, next){
	mongo.Db.connect(mongoUri, function(err, db){
		db.collection('TIU_submissions', function(err, col){
			console.log("made it in here!");
			col.find().toArray(function(err, items) {
				res.send(items);
			});
		});
	});
});

var port = process.env.PORT || 5000;

app.listen(port, function() {
	console.log("Listening in port " + port);
});


