
//included Models
var UserDetail = require('../models/userDetail');
var BookDetail = require('../models/bookDetail');

//included jsonwebtoken library
var jwt =require('jsonwebtoken');

//included configuration file
var config = require('../config/configuration');

//middleware to authenticate Token
exports.authenticateToken = function(req,res,next){

	console.log("auth Token token-key : "+ req.headers['token-key']);

	var token = req.body.token || req.headers['token-key'];

	if(token)
	{
		jwt.verify(token,config.tokenconfig.secret,function(err,decodedToken){

			if(err)
			{
				res.send({message : "invalid token !!!",msgtype : "E"});
			}
			else
			{
				console.log("token matched!!!");
				next();
			}

		});
	}
	else
	{
		res.send({message : "invalid user!!!",msgtype : "E"});
	}
}

//To create user
exports.createUser = function(req,res){
	
	var userdetail = new UserDetail({
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		emailid: req.body.emailid,
		password: req.body.password
	});

	userdetail.save(function(err,data){

		console.log("Save Data : ",data)

		if(err)
		{
			console.log("Create User Error: " + err);
			res.send({"message" : err,"msgTye" : "E"})
		}
		else
		{
			console.log("User Created Successfully!!!");
			res.send({message : "User Created Successfully!!!",msgTye : "S"});
		}
	});
}

//To Login user and get Access Token
exports.login = function(req,res){

	UserDetail.findOne({
		emailid : req.body.emailid
	},function(err,data){

		if(err) throw err;

		if(!data)
		{
			res.send({message:"No such user Exsist!",msgtype:"E"});
		}
		else
		{
			if(data.password != req.body.password)
			{
				res.send({message : "No such password exists!",msgtye : "E"});
			}
			else
			{
				var token = jwt.sign(data,config.tokenconfig.secret,{expiresIn: '1h'});

				res.send({message:"Token generated successfully!!!",msgtye : "S",tokenkey:token});
			}
		}

	});
}

//Add new book entry
exports.createBook = function(req,res){
	
	var bookdetail = new BookDetail({
		bookid: req.body.bookid,
		title: req.body.title,
		description: req.body.description,
		ifsc: req.body.ifsc
	});

	BookDetail.findOne(
		{bookid : req.body.bookid}
		,function(err,data){

			if(err) throw err

			if(!data)
			{
				//Add Book if id not found
				bookdetail.save(function(err,data){

					console.log("Save Data : ",data)

					if(err)	
					{
						console.log("Added Book Error: " + err);
						res.send({"message" : err,"msgTye" : "E"})
					}
					else
					{
						console.log("Book Added Successfully!!!");
						res.send({message : "Book Added Successfully!!!",msgTye : "S"});
					}
				});
			}
			else
			{
				//Bookid already exsist in db 
				console.log("BookId already exsist!!!");
				res.send({message : "BookId already exsist!!!",msgTye : "S"});
			}

		});
}

//retive all books
exports.getAllBook = function(req,res){

	BookDetail.find({},function(err,data){

		if(err)
		{
			res.send({message:"Oops something went wrong!!!",msgTye : "E"});
		}
		else
		{
			if(data.length == 0)
			{
				res.send({message : "No data available!!!",msgtype : "S",Data:data});
			}
			else
			{
				res.send({message : "Data retrive successfully !!!",msgtype : "S",Data:data});
			}
		}
	});
}

//get book by bookid
exports.getBookById = function(req,res){

	var _bookid = req.body.bookid;

	BookDetail.find({bookid : _bookid},function(err,data){

		if(err)
		{
			res.send({message:"Oops something went wrong!!!",msgTye : "E"});
		}
		else
		{
			if(data.length == 0)
			{
				res.send({message : "No data available!!!",msgtype : "S",Data:data});
			}
			else
			{
				res.send({message : "Data retrive successfully !!!",msgtype : "S",Data:data});
			}
		}
	});
}

//delete book by bookid
exports.deleteByBookId = function(req,res){

	var _bookid = req.params.bookid;
	BookDetail.remove({bookid : _bookid},function(err,result){

		if(err)
		{
			res.send({message:"Oops something went wrong!!!",msgTye : "E"});
		}

		if(result.ok == 1)
		{
			res.send({message : "Data deleted successfully!!!",msgtype : "S",Data:result});
		}
		else
		{
			res.send({message : "No Data found provided bookid!!!",msgtype : "S",Data:result});	
		}
	});	
}

//update book details by bookid
exports.updateBookByBookId = function(req,res){

	var _bookid = req.body.bookid;
	var _title = req.body.title;
	var _description = req.body.description;
	var _ifsc = req.body.ifsc;

	var selectionObject = {bookid : _bookid};
	var projectionObject = {title : _title, description:_description, ifsc:_ifsc}

	BookDetail.updateOne(selectionObject,projectionObject,function(err,result){

		console.log("result : " + result);

		if(err)
		{
			res.send({message:"Oops something went wrong!!!",msgTye : "E"});
		}
		else
		{
			if(result.n == 1)
			{
				res.send({message : "Data retrive successfully !!!",msgtype : "S",Data:result});
			}
			else
			{
				res.send({message : "No data available!!!",msgtype : "S",Data:result});
			}
		}
	});
}