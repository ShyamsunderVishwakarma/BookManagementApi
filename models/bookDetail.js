var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookDetailSchema = new Schema({

	bookid: { type:Number,require:true,unique:true},
	title: { type:String,require : true},
	description: { type:String},
	ifsc: { type:String,require:true}
});

var BookDetail = mongoose.model('BookDetail',bookDetailSchema,'bookdetail');

module.exports = BookDetail;