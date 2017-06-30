var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookDetailSchema = new Schema({

	bookid: { type:Number},
	title: { type:String},
	description: { type:String},
	ifsc: { type:String}
});

var BookDetail = mongoose.model('BookDetail',bookDetailSchema,'bookdetail');

module.exports = BookDetail;