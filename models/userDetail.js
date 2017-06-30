var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userDetailSchema = new Schema({
	firstname: { type: String},
	lastname: { type: String},
	emailid: { type: String},
	password: { type: String}
});

var UserDetail = mongoose.model('UserDetail',userDetailSchema);

module.exports = UserDetail;