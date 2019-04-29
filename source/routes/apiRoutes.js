var express = require('express');
var _ = require('underscore');
var moment = require("moment");
var Mom = require('../models/momModel');
var router = express.Router();
var config = require('../config');

var routes = function() {
	var router = express.Router();

	router.route('/moms')
		.get(function (request, response) {
			var query = request.query;
			// if 'find' is present then do a 'starts with' search
			if  (query.find) {
				Mom.find({ $or: [
					{ 'firstName': new RegExp('^'+query.find, "i") },
					{ 'lastName': new RegExp('^'+query.find, "i") }
				] }, function (err, moms) {
					if (err)
						response.status(500).send(err);
					else
						response.json(moms);
				});
			} else {
				// convert the query to be case-insensitive
				var caseInsensitiveQuery = _.mapObject(query, function (val, key) { return new RegExp('^'+val+'$', "i"); });

				// run the query
				Mom
					.find(caseInsensitiveQuery)
					.sort({ 'lastName': 1, 'firstName': 1})
					.exec(function (err, moms) {
						if (err)
							response.status(500).send(err);
						else
							response.json(moms);
					});
			}
		})
		.post(function (request, response) {
			var data = request.body;
			if (data.checkins && data.checkins.length > 0) {
				// calculate amount owed for all checkins
				_.each(data.checkins, function (checkin, i) {
					var amountOwed = Math.min(config.ratePerChild * checkin.numberOfChildren, config.maxPerFamily);
					_.extend(checkin, { amountOwed: amountOwed });
				});
			}
			var mom = new Mom(data);
			mom.save();
			response.status(201).send(mom);
		});
	router.route('/moms/reports')
		.get(function (request, response) {
			var query = request.query;
			var from = query.from;
			var to = query.to;

			from = (from) ? new Date(from) : new Date(new Date().setFullYear(new Date().getFullYear() - 1));
			to = (to) ? new Date(to) : new Date();

			Mom.find({ 'checkins.date': {
				$gt: from,
				$lt: to
			}}, function (err, moms) {
				if (err){
					response.status(500).send(err);
					return;
				}
					
				var dates = [];
				var projection = _.map(moms, function (mom) {
					mom.checkins = _.filter(mom.checkins, function (checkin) { return checkin.date > from && checkin.date < to; });
					dates.push(_.pluck(mom.checkins, 'date'));
					return mom;
				});
				var uniqueDates = _.uniq(_.flatten(dates), function (item) {return item.getTime(); });
				uniqueDates = _.sortBy(uniqueDates, function (item) { return item.getTime(); });
				uniqueDates = _.map(uniqueDates, function (item) { return moment(item).format("YYYY-MM-DD"); });

				response.json({
					uniqueDates: uniqueDates,
					moms: projection
				});
			});
		});
	router.route('/moms/:id')
		.get(function (request, response) {
			Mom.findById(request.params.id, function (err, mom) {
				if (err)
					response.status(500).send(err);
				else
					response.json(mom);
			});
		})
		.put(function (request, response) {
			Mom.findByIdAndUpdate(request.params.id, request.body, { new: true }, function (err, mom) {
				if (err)
					response.status(500).send(err);
				else
					response.json(mom);
			});
		})
		.delete(function (request, response) {
			Mom.findById(request.params.id).remove(function (err, mom) {
				if (err)
					response.status(500).send(err);
				else
					response.sendStatus(200);
			});
		});
	router.route('/moms/:id/checkin')
		.post(function (request, response) {
			var newCheckin = request.body;
			newCheckin.date = moment(newCheckin.date).toDate();
			newCheckin.amountOwed = Math.min(config.ratePerChild * newCheckin.numberOfChildren, config.maxPerFamily);
			Mom.findByIdAndUpdate(request.params.id, { $push: { checkins: newCheckin } }, { new: true }, function (err, mom) {
				if (err)
					response.status(500).send(err);
				else
					response.json(mom);
			});
		});

	return router;
};

module.exports = routes;