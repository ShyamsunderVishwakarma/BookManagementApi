
//included Models
var UserDetail = require('../models/userDetail');
var BookDetail = require('../models/bookDetail');

//included jsonwebtoken library
var jwt =require('jsonwebtoken');

//included paswword hashing  library
var passwordHash = require('password-hash');

//include check type for validating value
var check = require('check-types');

//include email validator library
var emailCheck = require("email-validator");

//included configuration file
var config = require('../config/configuration');

//middleware to authenticate Token


//To create user
exports.createUser = function(req,res){
	
	var _firstname = req.body.firstname;
	var _emailid = req.body.emailid;
	var _password = req.body.password;

	if(check.null(_firstname) || check.undefined(_firstname) ||check.emptyString(_firstname))
	{
		res.send({"message" : "Proper firstname required","msgTye" : "E",StatusCode:"200"})
	}
	elseif ((check.null(_emailid)) || (check.undefined(_emailid)) 
		|| (check.emptyString(_emailid)) || !(emailCheck.validate(_emailid)))
	{
		res.send({"message" : "Proper emailid required","msgTye" : "E",StatusCode:"200"})
	}
	elseif(check.null(_password) || check.undefined(_password) ||check.emptyString(_password))
	{
		res.send({"message" : "Proper password required","msgTye" : "E",StatusCode:"200"})
	}

	var hashedPassword = passwordHash.generate(req.body.password);

	var userdetail = new UserDetail({
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		emailid: req.body.emailid,
		password: hashedPassword
	});

	userdetail.save(function(err,data){

		console.log("Save Data : ",data)

		if(err)
		{
			console.log("Create User Error: " + err);
			res.send({"message" : err,"msgTye" : "E",StatusCode:"502"});
		}
		else
		{
			console.log("User Created Successfully!!!");
			res.send({message : "User Created Successfully!!!",msgTye : "S",StatusCode:"200"});
		}
	});
}

//To Login user and get Access Token
exports.login = function(req,res){

	console.log("email id : " + req.body.emailid);

	UserDetail.findOne({
		emailid : req.body.emailid
	},function(err,data){

		if(err) throw err;

		if(!data)
		{
			res.send({message:"No such user Exsist!",msgtype:"E",StatusCode:"502"});
		}
		else
		{
			if( ! passwordHash.verify(req.body.password, data.password))
			{
				res.send({message : "No such password exists!",msgtye : "E",StatusCode:"200"});
			}
			else
			{
				var token = jwt.sign(data,config.tokenconfig.secret,{expiresIn: '1h'});

				res.send({message:"Token generated successfully!!!",msgtye : "S",tokenkey:token,StatusCode:"200"});
			}
		}

	});
}

//Add new book entry
exports.createBook = function(req,res){
	
	var _bookid = req.body.bookid;
	var _title = req.body.title;
	var _description = req.body.description;
	var _ifsc = req.body.ifsc;

	if(check.null(_bookid) || check.undefined(_bookid) ||check.emptyString(_bookid))
	{
		res.send({"message" : "Bookid required","msgTye" : "E",StatusCode:"200"})
	}
	elseif(check.null(_title) || check.undefined(_title) ||check.emptyString(_title))
	{
		res.send({"message" : "Book title required","msgTye" : "E",StatusCode:"200"})
	}
	elseif(check.null(_description) || check.undefined(_description) ||check.emptyString(_description))
	{
		res.send({"message" : "Book description required","msgTye" : "E",StatusCode:"200"})
	}
	elseif(check.null(_ifsc) || check.undefined(_ifsc) ||check.emptyString(_ifsc))
	{
		res.send({"message" : "Book ifsc required","msgTye" : "E",StatusCode:"200"})	
	}

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
						res.send({"message" : err,"msgTye" : "E",StatusCode:"502"})
					}
					else
					{
						console.log("Book Added Successfully!!!");
						res.send({message : "Book Added Successfully!!!",msgTye : "S",StatusCode:"201"});
					}
				});
			}
			else
			{
				//Bookid already exsist in db 
				console.log("BookId already exsist!!!");
				res.send({message : "BookId already exsist!!!",msgTye : "S",StatusCode:"200"});
			}

		});
}

//retive all books
exports.getAllBook = function(req,res){

	BookDetail.find({},function(err,data){

		if(err)
		{
			res.send({message:"Oops something went wrong!!!",msgTye : "E",StatusCode:"502"});
		}
		else
		{
			if(data.length == 0)
			{
				res.send({message : "No data available!!!",msgtype : "S",Data:data,StatusCode:"200"});
			}
			else
			{
				res.send({message : "Data retrive successfully !!!",msgtype : "S",Data:data,StatusCode:"200"});
			}
		}
	});
}

//get book by bookid
exports.getBookById = function(req,res){

	var _bookid = req.params.bookid;

	BookDetail.find({bookid : _bookid},function(err,data){

		if(err)
		{
			res.send({message:"Oops something went wrong!!!",msgTye : "E",StatusCode:"502"});
		}
		else
		{
			if(data.length == 0)
			{
				res.send({message : "No data available!!!",msgtype : "S",Data:data,StatusCode:"200"});
			}
			else
			{
				res.send({message : "Data retrive successfully !!!",msgtype : "S",Data:data,StatusCode:"200"});
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
			res.send({message:"Oops something went wrong!!!",msgTye : "E",StatusCode:"502"});
		}

		if(result.ok == 1)
		{
			res.send({message : "Data deleted successfully!!!",msgtype : "S",Data:result,StatusCode:"200"});
		}
		else
		{
			res.send({message : "No Data found provided bookid!!!",msgtype : "S",Data:result,StatusCode:"200"});	
		}
	});	
}

//update book details by bookid
exports.updateBookByBookId = function(req,res){

	var _bookid = req.body.bookid;
	var _title = req.body.title;
	var _description = req.body.description;
	var _ifsc = req.body.ifsc;

	var selectionObject = {bookid : req.params.bookid};
	var projectionObject = {title : _title, description:_description, ifsc:_ifsc}

	BookDetail.updateOne(selectionObject,projectionObject,function(err,result){

		console.log("result : " + result);

		if(err)
		{
			res.send({message:"Oops something went wrong!!!",msgTye : "E",StatusCode:"502"});
		}
		else
		{
			if(result.n == 1)
			{
				res.send({message : "Data updated successfully !!!",msgtype : "S",Data:result,StatusCode:"200"});
			}
			else
			{
				res.send({message : "No data available!!!",msgtype : "S",Data:result,StatusCode:"200"});
			}
		}
	});
}