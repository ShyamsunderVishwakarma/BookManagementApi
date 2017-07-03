var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookDetailSchema = new Schema({
	title: { type:String,required : true},
	description: { type:String},
	isbn: { type:String,required:true,unique:true}
});

var BookDetail = mongoose.model('BookDetail',bookDetailSchema,'bookdetail');

module.exports = BookDetail;