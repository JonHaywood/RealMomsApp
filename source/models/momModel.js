var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define's the schema for a Mom
var momModel = new Schema({
	firstName: { type: String },
	lastName: { type: String },
	birthday: { type: Date },
	startingBalance: { type: Number, default: 0 },
	checkins: [{
		momPresent: { type: Boolean },
		date: { type: Date, default: Date.now },
		numberOfChildren: { type: Number },
		amountPaid: { type: Number, default: 0 },
		amountOwed: { type: Number, default: 0 }
	}],
	otherPayments: [{
		date: { type: Date, default: Date.now },
		amountPaid: { type: Number }
	}]
});

// Virtual field definition. Virtual fields aren't persisted
// to the database.
momModel.virtual('currentBalance').get(function () {
	var balance = this.startingBalance;

 	// account for checkins per kid and amount paid
 	if (this.checkins) {
	  for (var i = 0; i < this.checkins.length; i++) {
		var checkin = this.checkins[i];
		var charge = checkin.amountPaid - checkin.amountOwed;
		balance = balance + charge;
	  }
	}

	// account for other payments
	if (this.otherPayments) {
		for (var i = 0; i < this.otherPayments.length; i++) {
	  		var payment = this.otherPayments[i];
	  		balance = balance + payment.amountPaid;
		}
	}

 	return balance;
});
// Include virtual fields in the JSON being sent back to the client.
momModel.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Mom', momModel);