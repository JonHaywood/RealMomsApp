define([
    'jquery',
    'underscore',
    'ui',
    'moment',
    'validation',
    'bootstrap-typeahead'
], function ($, _, ui, moment) {

	var mapping = {
		firstName: '#firstName',
		lastName: '#lastName',
		numberOfChildren: '#numberOfChildren',
		amountPaid: '#amountPaid',
		momPresent: '#momPresent',
		date: '#date'
	};
	var extraMapping = {
		birthday: '#birthday',
		startingBalance: '#startingBalance'
	};
	var isNew = false;
	var currentBalance = 0;
	var existingMom;

	var extractInput = function () {
		var input = {
			isNew: isNew,
			data: {},
			extraData: {}
		};
		for (var key in mapping) {
			input.data[key] = $(mapping[key]).val();
		}
		input.data.momPresent = $(mapping.momPresent).is(':checked');
		for (var key in extraMapping) {
			input.extraData[key] = $(extraMapping[key]).val();
		}
		return input;
	};

	var setDisplayData = function (data, extraData) {
		for (var key in mapping) {
			if (key == 'date') {
				if (moment($(mapping[key]).val(), "YYYY-MM-DD").diff(moment(), 'days') == 0)
					$(mapping[key] + 'Display').text('Today');
				else
					$(mapping[key] + 'Display').text(moment($(mapping[key]).val(), "YYYY-MM-DD").format('MM/DD/YYYY'));
			} else if (key == 'momPresent') {
				$(mapping[key] + 'Display').text(mapping[key] ? 'Yes' : 'No');
			} else {
				$(mapping[key] + 'Display').text(data[key]);
			}
		}
		if (extraData) {
			for (var key in extraMapping) {
				$(extraMapping[key] + 'Display').text(extraData[key]);
			}
		}
	};

	var findMom = function () {
		var firstName = $(mapping.firstName).val();
		var lastName = $(mapping.lastName).val();

		return $.get('api/moms/', {
			firstName: firstName,
			lastName: lastName
		});
	};

	var onNext_Step1 = function () {
		findMom().done(function (results) {
			console.log('Finding mom with input. Results:', results);
			if (results.length > 0) {
				isNew = false;
				existingMom = results[0];
				currentBalance = existingMom.currentBalance;
				var date = $(mapping.date).val();

				// see if there were any other checkins from today for this mom
				var checkinForSameDay = _.find(existingMom.checkins, function (checkin) {
					return new Date(checkin.date).setHours(0,0,0,0) === new Date(date).setHours(0,0,0,0);
				});
				if (checkinForSameDay) {
					var dayStr = moment().diff(moment(checkinForSameDay.date), 'days') == 0 ? 'today' : 'on ' + moment(checkinForSameDay.date).format('MM/DD/YYYY');
					// show the alert saying the user has checked in already
					swal({
						title: "Already Checked In!",
						text: "This person has already checked in " + dayStr + ". Click YES to delete the previous checkin and proceed or click Cancel.",
						type: "warning",
						showCancelButton: true,
						confirmButtonText: "Yes, delete it"
					}, function () {
						// if we're here they've chosen to delete the existing checkin
						existingMom.checkins = _.reject(existingMom.checkins, function (checkin) { return checkin === checkinForSameDay });
						$.ajax({
						    url: 'api/moms/' + existingMom._id,
						    type: 'PUT',
						    contentType: 'application/json',
						    data: JSON.stringify(existingMom)
						}).done(loadStep2);
					});
				} else {
					loadStep2();
				}
			}
			else {
				isNew = true;
				loadStep2();
			}
		});
	};

	var loadStep2 = function () {
		$('#step1').fadeOut(function () {
			$(this).hide();
			if (isNew)
				$('#step2').fadeIn();
			else
				loadStep3();
		});
	};

	var onNext_Step2 = function () {
		$('#step2').fadeOut(function () {
			$(this).hide();
			loadStep3();
		});
	};

	var loadStep3 = function () {
		console.log('Loading step 3.');
		var input = extractInput();
		setDisplayData(input.data, input.extraData);

		if (isNew)
			$('#isNewDisplay').show();
		else
			$('#isNewDisplay').hide();

		if (currentBalance <= 0 && input.data.amountPaid <= 0 && input.data.numberOfChildren > 0)
			$('#hasNotPrepaid').show();
		else
			$('#hasNotPrepaid').hide();

		$('#step3').fadeIn();
	};

	var onPrev_Step3 = function () {
		if (isNew) {
			$('#step3').fadeOut(function () {
				$(this).hide();
				$('#step2').fadeIn();
			});
		} else {
			$('#step3').fadeOut(function () {
				$(this).hide();
				$('#step1').fadeIn();
			});
		}
	};

	var onSubmitCheckin = function () {
		var input = extractInput();
		console.log('checkin submitted:', input);

		if (isNew) {
			var record = {
				firstName: input.data.firstName,
				lastName : input.data.lastName,
				birthday: input.extraData.birthday,
				startingBalance: input.extraData.startingBalance,
				checkins: [{
					momPresent: input.data.momPresent,
					numberOfChildren: input.data.numberOfChildren,
					amountPaid: input.data.amountPaid,
					date: input.data.date
				}]
			};
			$.ajax({
			    url: 'api/moms',
			    type: 'POST',
			    contentType: 'application/json',
			    data: JSON.stringify(record)
			}).done(loadStep4);
		} else {
			var checkin = {
				momPresent: input.data.momPresent,
				numberOfChildren: input.data.numberOfChildren,
				amountPaid: input.data.amountPaid,
					date: input.data.date
			};
			$.ajax({
			    url: 'api/moms/' + existingMom._id + '/checkin',
			    type: 'POST',
			    contentType: 'application/json',
			    data: JSON.stringify(checkin)
			}).done(loadStep4);
		}
	};

	var loadStep4 = function () {
		$('#step3').fadeOut(function () {
			$(this).hide();
			$('#step4').fadeIn();
		});
	};

	var simpleButtonHandler = function () {
		var $this = $(this);
		$($this.attr('data-hide')).fadeOut(function () {
			$($this.attr('data-show')).fadeIn();
		});
	};

	var resetForm = function () {
		// clear everything
		for (var key in mapping) {
			$(mapping[key]).val('');
		}
		for (var key in extraMapping) {
			$(extraMapping[key]).val('');
		}
		// set defaults
		$(mapping.momPresent).attr('checked', 'checked');
		$(mapping.amountPaid).val('0');
		$(mapping.numberOfChildren).val('1');
		$(mapping.date).val(moment().format('YYYY-MM-DD'));
		$(extraMapping.startingBalance).val('0');

		isNew = false;
		currentBalance = 0;

		$('#checkin-steps > div').hide().first().show(); // only show 1st step
		$('#dateDiv').hide();
		$('#dateLink').show();
		$('#hasNotPrepaid').hide();
	};

	var onShowCheckinDate = function (e) {
		e.preventDefault();
		$('#dateDiv').show();
		$('#dateLink').hide();
		return false;
	};

	var initialize = function () {
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

		// set up type ahead
		$(mapping.firstName+','+mapping.lastName).typeahead({
			hint: true,
			highlight: true,
			minLength: 1,
			fitToElement: true,
			source: function (query, process) {
				return  $.get('/api/moms?find=' + query, function (data) {
					return process(data);
				});
			},
			displayText: function (item) {
				return item.firstName + ' ' + item.lastName;
			},
			afterSelect: function (item) {
				$(mapping.firstName).val(item.firstName);
				$(mapping.lastName).val(item.lastName);
			}
		});

		// set default date of today for checkins
		$(mapping.date).val(moment().format('YYYY-MM-DD'));

		$('#step1 form').validate({	submitHandler: onNext_Step1	}); // initialize validation on forms
		$('#step2 form').validate({	submitHandler: onNext_Step2	}); // initialize validation on forms
		$('#step3 .prev').on('click', onPrev_Step3);		// set up event handlers
		$('#step3 .next').on('click', onSubmitCheckin);		// set up event handlers
		$('#step4 button').on('click', resetForm);			// set up event handlers
		$('button[data-show][data-hide]').on('click', simpleButtonHandler);  // set up event handlers
		$('#dateLink a').on('click', onShowCheckinDate);
	};

    var run = function (tpl) {
    	ui.renderTemplate(tpl);
    	initialize();
    };

    return {
        run: run
    };
});