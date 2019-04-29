define([
    'jquery',
    'underscore',
    'ui',
    'moment',
    'bootstrap-table',
    'validation'
], function ($, _, ui, moment) {

	var $table;

	var initializeForm = function () {
		$('input[name="fromDate"]').val(moment().subtract(9, 'months').format('YYYY-MM-DD'));
		$('input[name="toDate"]').val(moment().format('YYYY-MM-DD'));
		$(document).on('submit', 'form', function (e) {
			e.preventDefault();
			initializeTable();
		});
	};

	var initializeTable = function () {
		var fromDate = $('input[name="fromDate"]').val();
		var toDate = $('input[name="toDate"]').val();

		if (!moment(fromDate).isValid() || !moment(toDate).isValid()) {
			ui.alert('Check the from and to dates to make sure they are valid.');
			return;
		}

		$.ajax({
		    url: 'api/moms/reports',
		    type: 'GET',
		    data: { from: fromDate, to: toDate }
		}).done(function (data) {
			var $table = $('#records');

			$table.empty();

			var uniqueDates = data.uniqueDates.sort();
			var uniqueDatesTotals = []; // array of zeros
			_.times(uniqueDates.length, function () { uniqueDatesTotals.push(0); });
			var sortedMoms = data.moms.sort(function (a, b) {
				if(a.lastName < b.lastName) return -1;
			    if(a.lastName > b.lastName) return 1;
			    return 0;
			});

			// create table header
			var $header = $('<tr>');
			$header.append('<th>Name</th>');
			_.each(uniqueDates, function (date) {
				$header.append('<th>' + moment(date).format('MMM DD') + '</th>');
			});
			$header.append('<th>Total</th>')
			$table.append($('<thead>').append($header));

			// create table rows
			var rows = [];
			_.each(sortedMoms, function (mom) {
				var $row = $('<tr>');
				$row.append('<td>' + mom.firstName + ' ' + mom.lastName + '</td>');

				var totalAttendances = 0;

				_.each(uniqueDates, function (date, i) {
					var inAttendance =_.some(mom.checkins, function (checkin) { 
						var isSameDate = moment(checkin.date, "YYYY-MM-DD").isSame(date, 'day');
						var isPresent = checkin.momPresent === true; 
						return isSameDate && isPresent;
					});

					if (inAttendance)
						totalAttendances++;
					if (inAttendance)
						uniqueDatesTotals[i]++;

					$row.append('<td class="text-center text-muted">' + (inAttendance ? '<span class="glyphicon glyphicon-ok"></span>' : ' ') + '</td>');
				});

				$row.append('<td>' + totalAttendances + '</td>');

				rows.push($row);
			});
			$table.append($('<tbody>').append(rows));

			// create table footer
			var $footer = $('<tr>');
			$footer.append('<th>Meeting Totals</th>');
			rows = [];
			_.each(uniqueDatesTotals, function (total) {
				rows.push('<th class="text-center">' + total + '</th>');
			});
			rows.push('<th></th>');
			$footer.append(rows);
			$table.append($('<tfoot>').append($footer));
		});
	};

	var initialize = function () {
		initializeForm();
		initializeTable();
		//$table.on('click', '.view-checkins', showCheckins);
	};

    var run = function (tpl) {
    	ui.renderTemplate(tpl);
    	initialize();
    };

    return {
        run: run
    };
});