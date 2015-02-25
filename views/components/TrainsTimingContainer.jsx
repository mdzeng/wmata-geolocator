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
			<div>
				<p className="next-trains">Next Trains</p>
				<ul class="list-group" >

				{
					_.map(this.state.trainTimings, function(trainTime) {
						return (
							  <li className="list-group-item">
								  <p className="lead dests">
									  <span id="destName">{trainTime.DestinationName}</span>
									  <span className="pull-right" id="destTime">{trainTime.Min}</span>
								  </p>
							  </li>
						)
					})
				}
				</ul>
			</div>
		);
	}
});