var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userDetailSchema = new Schema({
	firstname: { type: String,require:true},
	lastname: { type: String},
	emailid: { type: String,require:true,unique:true},
	password: { type: String,require:true,unique:true}
});

var UserDetail = mongoose.model('UserDetail',userDetailSchema,'userdetails');

module.exports = UserDetail;