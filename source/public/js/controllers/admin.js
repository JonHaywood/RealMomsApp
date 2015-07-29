define([
    'jquery',
    'underscore',
    'ui',
    'moment',
    'bootstrap-table',
    'bootstrap-table-editable',
    'validation'
], function ($, _, ui, moment) {

	var $table;
	var $paymentTable;
	var $checkinTable;

	var addMom = function (record) {
		return $.ajax({
		    url: 'api/moms/',
		    type: 'POST',
		    contentType: 'application/json',
		    data: JSON.stringify(record)
		}).fail(function () {
			swal('Ooops...', 'Something went wrong when saving this record. Please reload the page.');
		});
	};

	var updateMom = function (record) {
		return $.ajax({
		    url: 'api/moms/' + record._id,
		    type: 'PUT',
		    contentType: 'application/json',
		    data: JSON.stringify(record)
		}).fail(function () {
			swal('Ooops...', 'Something went wrong when saving this record. Please reload the page.');
		});
	};

	var getRowData = function (el) {
		var index = $(el).closest('tr').index();
		return $table.bootstrapTable('getData')[index];
	};

	var updateRowValue = function (field, response, newValue) {
		var record = getRowData(this);
		record[field] = newValue;
		updateMom(record);
	};

	var initializeTable = function () {
		return $('#records').bootstrapTable({
		    columns: [{
		        field: 'firstName',
		        title: 'First Name',
		        editable: {	mode: 'inline',	success: _.partial(updateRowValue, 'firstName') }
		    }, {
		        field: 'lastName',
		        title: 'Last Name',
		        editable: {	mode: 'inline',	success: _.partial(updateRowValue, 'lastName') }
		    }, {
		        field: 'birthday',
		        title: 'Birthday',
		        formatter: function (val, row, index) {
		        	return moment(val).format('MM/DD/YYYY');
		        },
		        editable: {	mode: 'inline',	success: _.partial(updateRowValue, 'birthday') }
		    }, {
		    	field: 'startingBalance',
		    	title: 'Starting Balance',
		    	editable: {
		    		mode: 'inline',
		    		success: _.partial(updateRowValue, 'startingBalance'),
		    		display: function(val) {
				      $(this).text((val >= 0) ? '$' + val : '-$' + (val * -1));
				    }
				}
		    }, {
		    	field: 'currentBalance',
		    	title: 'Current Balance',
		    	formatter: function (val, row, index) {
		    		return (val >= 0) ? '$' + val : '-$' + (val * -1);
		    	}
		    }, {
		    	field: 'checkins',
		    	title: 'Checkins',
		    	align: 'center',
		    	formatter: function (val, row, index) {
		    		return '<button type="button" class="btn btn-primary btn-xs view-checkins" data-toggle="modal" data-target="#checkinModal">View</button>';
		    	}
		    }, {
		    	field: 'otherPayments',
		    	title: 'Other Payments',
		    	align: 'center',
		    	formatter: function (val, row, index) {
		    		return '<button type="button" class="btn btn-primary btn-xs view-payments" data-toggle="modal" data-target="#paymentModal">View</button>';
		    	}
		    }],
		    url: 'api/moms',
		    queryParams: function (params) {
		    	// remove these from the query string, it breaks the ajax call
		    	delete params.order;
		    	delete params.search;
		    	return params;
		    },
		    showColumns: true,
		    showRefresh: true,
		    search: true
		});
	};

	var showCheckins = function () {
		var index = $(this).closest('tr').index();
		var data = $table.bootstrapTable('getData')[index];

		// if previously created, destroy
		if ($checkinTable)
			$checkinTable.bootstrapTable('destroy');

		// initialize checkins table
		$checkinTable = $('#checkins').bootstrapTable({
			columns: [{
				field: 'amountPaid',
				title: 'Amount Paid',
				formatter: function (val, row, index) {	return  '$'+val; }
			}, {
				field: 'date',
				title: 'Date',
				formatter: function (val, row, index) {
					return moment(val).format('MM/DD/YYYY');
				}
			}, {
				field: 'momPresent',
				title: 'Mom Present?',
				formatter: function (val, row, index) {
					return (val) ? 'Yes' : 'No';
				}
			}, {
				field: 'numberOfChildren',
				title: 'Number of Children'
			}, {
				field: 'amountOwed',
				title: 'Amount Owed',
				formatter: function (val, row, index) {	return  '$'+val; },
				visible: false
			}, {
				field: '_id',
				title: 'Operations',
				align: 'center',
				formatter: function (val, row, index) {
					return '<button type="button" class="btn btn-default btn-xs checkin-delete"><span class="glyphicon glyphicon-remove"></span></button>';
				}
			}],
			data: data.checkins,
			showColumns: true
		});
		$('#checkins').on('click', '.checkin-delete', function () {
			var index = $(this).closest('tr').index();
			swal({
				title: "Are you sure you want to delete this item?",
				text: "You will not be able to recover this data!",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Yes, delete it"
			}, function() {
				var checkinData = data.checkins[index];
				data.checkins = _.without(data.checkins, checkinData);

				updateMom(data).done(function (savedData) {
					// update what we have with what the server sent
					$.extend(data, savedData);
					$table.bootstrapTable('refresh'); // reload the main grid
					$checkinTable.bootstrapTable('load', data.checkins); // reload the grid
				});
			});
		});
	};

	var showOtherPayments = function () {
		var index = $(this).closest('tr').index();
		var data = $table.bootstrapTable('getData')[index];

		// if previously created, destroy
		if ($paymentTable)
			$paymentTable.bootstrapTable('destroy');

		// initialize checkins table
		$paymentTable = $('#payments').bootstrapTable({
			columns: [{
				field: 'amountPaid',
				title: 'Amount Paid',
				formatter: function (val, row, index) {	return  '$'+val; }
			}, {
				field: 'date',
				title: 'Date',
				formatter: function (val, row, index) {
					return moment(val).format('MM/DD/YYYY');
				}
			}, {
				field: '_id',
				title: 'Operations',
				align: 'center',
				formatter: function (val, row, index) {
					return '<button type="button" class="btn btn-default btn-xs payment-delete"><span class="glyphicon glyphicon-remove"></span></button>';
				}
			}],
			data: data.otherPayments,
			toolbar: '#paymentsToolbar'
		});

		// add event handler to form. Note that we're doing in inside
		// the handler for the button click so that we have access to the
		// record data via a closure
		$('#paymentModal form').off().on('submit', function (e) {
			e.preventDefault();

			// create data and add to array
			var payment = {
				amountPaid: $('#amountPaid').val(),
				date: $('#date').val()
			};
			data.otherPayments.push(payment);

			// update record
			updateMom(data).done(function (savedData) {
				// update what we have with what the server sent
				$.extend(data, savedData);
				$table.bootstrapTable('refresh'); // reload the main grid
				$paymentTable.bootstrapTable('load', data.otherPayments); // reload the grid
				// clear form
				$('#paymentModal form input').val('');
			});

			return false;
		});
		$('#payments').on('click', '.payment-delete', function () {
			var index = $(this).closest('tr').index();
			swal({
				title: "Are you sure you want to delete this item?",
				text: "You will not be able to recover this data!",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Yes, delete it"
			}, function() {
				var paymentData = data.otherPayments[index];
				data.otherPayments = _.without(data.otherPayments, paymentData);

				updateMom(data).done(function (savedData) {
					// update what we have with what the server sent
					$.extend(data, savedData);
					$table.bootstrapTable('refresh'); // reload the main grid
					$paymentTable.bootstrapTable('load', data.otherPayments); // reload the grid
				});
			});
		});
	};

	var addNewMom = function () {
		// create new record using input
		var record = {
			firstName: $('#firstName').val(),
			lastName: $('#lastName').val(),
			startingBalance: $('#startingBalance').val()
		};

		console.log("adding new mom:", record);
		addMom(record).done(function (result) {
			$table.bootstrapTable('refresh'); // reload the main grid
			$('#addMomModal').modal('hide'); // hide modal

			// clear out form
			$('#firstName').val('');
			$('#lastName').val('');
			$('#startingBalance').val('');
		});
	};

	var initialize = function () {
		$table = initializeTable();
		$table.on('click', '.view-checkins', showCheckins);
		$table.on('click', '.view-payments', showOtherPayments);

		// Set up form validation using the validator plugin. Code below will
		// override jquery validate plugin defaults so that it works
		// nicely with bootstrap 3
		$.validator.setDefaults({
		    highlight: function(element) {
		        $(element).closest('.form-group').addClass('has-error');
		    },
		    unhighlight: function(element) {
		        $(element).closest('.form-group').removeClass('has-error');
		    },
		    errorElement: 'span',
		    errorClass: 'help-block',
		    errorPlacement: function(error, element) {
		        if(element.parent('.input-group').length) {
		            error.insertAfter(element.parent());
		        } else {
		            error.insertAfter(element);
		        }
		    }
		});
		$('#addMomModal form').validate({ submitHandler: addNewMom }); // initialize validation on form
	};

    var run = function (tpl) {
    	ui.renderTemplate(tpl);
    	initialize();
    };

    return {
        run: run
    };
});