
// Initializing express
var express = require("express");
var app = express();
app.set('port', process.env.PORT || 8000);

// Initializing mongo and setting up a connection to a MongoDB
var mongo = require('mongodb');
var mongoUri = process.env.MONGOLAB_URI ||
	process.env.MONGOHQ_URL ||
	'mongodb://localhost/mydb';

// other dependencies
var http = require ("http");
var path = require ("path");
app.use(express.static(path.join(__dirname, 'public')));
var bodyParser = require("body-parser");
app.use(bodyParser());
app.set('view engine', 'jade');

// var routes = require('./routes/');

// // Handle requests for '/'
// app.use('/', routes);
// 	/function(request, response, next){
// 	response.send("Nothing here! Try another page");
// });

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

module.exports = app;

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});



app.post('/submit_hypothesis.json', function (request, response) {
	response.header("Access-Control-Allow-Origin", "*");
  	response.header("Access-Control-Allow-Headers", "X-Requested-With");
	mongo.Db.connect(mongoUri, function (err, db) {
		db.collection("hypotheses", function (err, collection) {
			var name = request.body.student_name;
			var hypothesis = request.body.hypothesis;

			if (name === undefined || hypothesis === undefined) {
				response.send("Nay!");
			} else {
				var currDate = new Date();
				var timestamp = (currDate.getUTCMonth() + 1) + "/" + 
		    					currDate.getUTCDate() + "/" +
               					currDate.getUTCFullYear() + " - " + 
               					currDate.getHours() + ":" + 
                    			currDate.getMinutes() + ":" + 
                    			currDate.getSeconds();
                collection.insert({"student_name": name, "hypothesis": hypothesis, 
                					"created_at": timestamp}, function (error, res){});
                response.send('YAY!');
			}

		}); 
	});
});


// // posting and adding info to the database
// app.post('/submit_location.json', function (request, response) {
// 	response.header("Access-Control-Allow-Origin", "*");
//   	response.header("Access-Control-Allow-Headers", "X-Requested-With");
// 	mongo.Db.connect(mongoUri, function (err, db) {
// 			db.collection("locations", function (err, collection) {
// 			var student_name = request.body.student_name;
// 			var address = request.body.address;
// 			var latitude = request.body.lat;
// 			var longitude = request.body.lng;
// 			var resource_type = request.body.resource_type;

// 			if (student_name === undefined ||
// 				address === undefined || 
// 				latitude === undefined || 
// 				longitude === undefined || 
// 				resource_type === undefined) {
// 				response.send("Nay!");
// 			} else {
// 				score = parseInt(score);
// 				var currDate = new Date();
// 		    	var timestamp = (currDate.getUTCMonth() + 1) + "/" + 
// 		    					currDate.getUTCDate() + "/" +
//                					currDate.getUTCFullYear() + " - " + 
//                					currDate.getHours() + ":" + 
//                     			currDate.getMinutes() + ":" + 
//                     			currDate.getSeconds();
// 				collection.insert({"student name": student_name,
// 									"address": address, 
// 									"latitude": latitude, 
// 									"longitude": longitude, 
// 									"resource type": resource_type, 
// 									"created_at": timestamp}, function (error, r){});
// 				response.send("Yay!");
// 			}
// 		});
// 	});
// });

// app.get('/locations.json', function(request, response) {
// 	// enable cross origin sharing
// 	response.header("Access-Control-Allow-Origin", "*");
//   	response.header("Access-Control-Allow-Headers", "X-Requested-With");

//   	else {
//   		// connect database
// 		mongo.Db.connect(mongoUri, function (err, db) {
// 			db.collection("locations", function (err, col) {
// 				// find information
// 				col.find(function (err, items) {
// 					response.send(items);
// 				});
// 			});
// 		});
// 	}
// });



http.createServer(app).listen(app.get('port'), function() {
	console.log("Listening in on port " + app.get('port'));
});
