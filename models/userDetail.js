var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userDetailSchema = new Schema({
	firstname: { type: String,required:true},
	lastname: { type: String},
	emailid: { type: String,required:true,unique:true},
	password: { type: String,required:true}
});

var UserDetail = mongoose.model('UserDetail',userDetailSchema,'userdetail');

module.exports = UserDetail;