/** @jsx React.DOM */

var React = require('react');
var request = require('superagent');
var _ = require('lodash');

module.exports = React.createClass({
	propType: {
		stationCode: React.PropTypes.string
	},

	getInitialState: function() {
		return {
			trainTimings: []
		};
	},

	componentDidMount: function() {
		this.retrieveNextTrains(this.props.stationCode);
	},

	componentWillReceiveProps: function(nextProps) {
		this.retrieveNextTrains(nextProps.stationCode);
	},

	componentDidUpdate: function() {
		var self = this;
		setTimeout(function(){
			self.retrieveNextTrains(self.props.stationCode);
		}, 30000);
	},

	retrieveNextTrains: function(stationCode) {
		console.log("what is the station code" + stationCode);
		if (typeof stationCode !== 'undefined') {
			request.get('/nextTrains')
				.query({stationCode: stationCode})
				.end(_.bind(function (res) {
					this.setState({
						trainTimings: res.body
					});
			}, this));
		}
	},

	render: function() {
		return (
			<div className="next-trains-info">
			Next trains:
				<div>
				{
					_.map(this.state.trainTimings, function(trainTime) {
						return (
							<div>
								<p>{trainTime.DestinationName}: {trainTime.Min}</p>
							</div>
						)
					})
				}
				</div>
			</div>
		);
	}
});