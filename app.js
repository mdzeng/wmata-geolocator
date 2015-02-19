
/**
 * Module dependencies.
 */

var express = require('express');
var cors = require('cors');
var routes = require('./routes/index');
var http = require('http');
var path = require('path');
var templating = require('./lib/templating');
var app = express();
var url = require('url');
var bluebird = require('bluebird');
var request = bluebird.promisify(require('request'));

// all environments
app.engine('.html', templating);
app.set('view engine', '.html');
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.disable('etag');

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/', function (req, res) {
    res.render('landing');
});

app.get('/closestMetro', function(req, res) {
	var options = {
		url: 'https://api.wmata.com/Rail.svc/json/jStationEntrances',
		qs: {
			Lat: req.query.lat,
			Lon: req.query.lon,
			Radius: 500,
			api_key: 'g5mpvg4gcbmr3pcnvr9sc4ey'
		}
	};

	request(options)
	.then(function(entrances) {
		var stationCode = JSON.parse(entrances[0].body)["Entrances"][0].StationCode1;
		options = {
			url: 'https://api.wmata.com/Rail.svc/json/jStationInfo',
			qs: {
				StationCode: stationCode,
				api_key: 'g5mpvg4gcbmr3pcnvr9sc4ey'
			}
		};

		request(options)
		.then(function(station) {
			//res.send(station);
			var stationName = JSON.parse(station[0].body).Name;
			res.send({name: stationName, stationCode: stationCode});
		});
	});

});


app.get('/nextTrains', function(req, res) {
	var options = {
		url: 'https://api.wmata.com/StationPrediction.svc/json/GetPrediction/' + req.query.stationCode,
		qs: {
			api_key: 'g5mpvg4gcbmr3pcnvr9sc4ey'
		}
	};

	request(options)
	.then(function(trains) {
		res.send(JSON.parse(trains[0].body)["Trains"]);
	});

});


//When routes are set up, use the routes middleware
//app.use('/', routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
