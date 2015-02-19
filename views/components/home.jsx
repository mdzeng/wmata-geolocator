/** @jsx React.DOM */

var React = require('react');
var request = require('superagent');
var _ = require('lodash');

var NextTrain = require('./TrainsTimingContainer.jsx');


module.exports = React.createClass({
	componentDidMount: function() {
		var self = this;
		if (navigator.geolocation) {
			var failure, success, progress;
			success = function(position) {
				request.get('/closestMetro')
				.query({lat: position.coords.latitude})
				.query({lon: position.coords.longitude})
				.end(_.bind(function(res){
					self.setState({
						stationCode: res.body.stationCode,
						closestMetro: res.body.name,
						searchFinished: true
					});
				}, this));
			};
			failure = function() {
				self.setState({
					searchFinished: true
				});
			};
			progress = function() {
			};
			navigator.geolocation.getAccurateCurrentPosition(success, failure, progress, {desiredAccuracy:50, maxWait:5000});
		}
	},

	getInitialState: function() {
		return {
			stationCode: null,
			closestMetro: null,
			searchFinished: false
		};
	},

	renderNoMetro: function() {
		return (
			<div>
			{
				this.state.searchFinished ?	<p>Sorry, no nearby metro</p>
				: <p>Searching for nearby metro stations...</p>
			}
			</div>
		);
	},

	render: function() {
		return (
			<div className="home">
				{this.state.closestMetro ? <div><p>Your Closest Metro Is: {this.state.closestMetro}</p></div>
					:  this.renderNoMetro()
				}
				<NextTrain stationCode={this.state.stationCode}/>
			</div>
		);
	}
});