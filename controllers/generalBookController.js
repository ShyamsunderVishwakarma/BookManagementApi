
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

//To create user
exports.createUser = function(req,res){
	
	var _firstname = req.body.firstname;
	var _emailid = req.body.emailid;
	var _password = req.body.password;

	if(check.null(_firstname) || check.undefined(_firstname) ||check.emptyString(_firstname))
	{
		return res.send({"message" : "Proper firstname required","msgTye" : "E"}).status(400)
	}
	else if(!(emailCheck.validate(_emailid)))
	{
		return res.send({"message" : "Proper emailid required","msgTye" : "E"}).status(400);
	}
	else if(check.null(_password) || check.undefined(_password) ||check.emptyString(_password))
	{
		return res.send({"message" : "Proper password required","msgTye" : "E"}).status(400);
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
			return res.send({"message" : err,"msgTye" : "E"}).status(500);
		}
		else
		{
			console.log("User Created Successfully!!!");
			return res.send({message : "User Created Successfully!!!",msgTye : "S"}).status(201);
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
			return res.send({message:"No such user Exsist!",msgtype:"E"}).status(401);
		}
		else
		{
			if( ! passwordHash.verify(req.body.password, data.password))
			{
				return res.send({message : "No such password exists!",msgtye : "E"}).status(401);
			}
			else
			{
				var token = jwt.sign(data,config.tokenconfig.secret,{expiresIn: '1h'});

				return res.send({message:"Token generated successfully!!!",msgtye : "S",tokenkey:token}).status(201);
			}
		}

	});
}

//Add new book entry
exports.createBook = function(req,res){
	
	var _title = req.body.title;
	var _description = req.body.description;
	var _isbn = req.body.isbn;

	
    if(check.null(_title) || check.undefined(_title) ||check.emptyString(_title))
	{
		return res.send({"message" : "Book title required","msgTye" : "E"}).status(400)
	}
	else if(check.null(_isbn) || check.undefined(_isbn) ||check.emptyString(_isbn))
	{
		return res.send({"message" : "Book ifsc required","msgTye" : "E"}).status(400)	
	}

	var bookdetail = new BookDetail({
		title: req.body.title,
		description: req.body.description,
		isbn: req.body.isbn
	});

	BookDetail.findOne(
		{isbn : req.body.isbn}
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
						return res.send({"message" : err,"msgTye" : "E"}).status(500);
					}
					else
					{
						console.log("Book Added Successfully!!!");
						return res.send({message : "Book Added Successfully!!!",msgTye : "S"}).status(201);
					}
				});
			}
			else
			{
				//Bookid already exsist in db 
				console.log("Isbn already exsist!!!");
				return res.send({message : "Isbn already exsist!!!",msgTye : "S"}).status(400);
			}

		});
}

//retive all books
exports.getAllBook = function(req,res){

	BookDetail.find({},function(err,data){

		if(err)
		{
			return res.send({message:"Oops something went wrong!!!",msgTye : "E"}).status(500);
		}
		else
		{
			if(data.length == 0)
			{
				return res.send({message : "No data available!!!",msgtype : "S",Data:data}).status(200);
			}
			else
			{
				return res.send({message : "Data retrive successfully !!!",msgtype : "S",Data:data}).status(200);
			}
		}
	});
}

//get book by bookid
exports.getBookById = function(req,res){

	var _isbn = req.params.isbn;

	BookDetail.find({isbn : _isbn},function(err,data){

		if(err)
		{
			return res.send({message:"Oops something went wrong!!!",msgTye : "E"}).status(500);
		}
		else
		{
			if(data.length == 0)
			{
				return res.send({message : "No data available!!!",msgtype : "S",Data:data}).status(200);
			}
			else
			{
				return res.send({message : "Data retrive successfully !!!",msgtype : "S",Data:data}).status(200);
			}
		}
	});
}

//delete book by bookid
exports.deleteByBookId = function(req,res){

	var _isbn = req.params.isbn;

	BookDetail.remove({isbn : _isbn},function(err,result){

		if(err)
		{
			return res.send({message:"Oops something went wrong!!!",msgTye : "E"}).status(500);
		}

		var resultData = JSON.parse(result);

		if(resultData.n)
		{
			return res.send({message : "Data deleted successfully!!!",msgtype : "S",Data:result}).status(200);
		}
		else
		{
			return res.send({message : "No Data found for provided isbn!!!",msgtype : "S",Data:result}).status(400);	
		}
	});	
}

//update book details by bookid
exports.updateBookByBookId = function(req,res){

	var _title = req.body.title;
	var _description = req.body.description;
	var _isbn = req.body.isbn;

	var selectionObject = {isbn : req.params.isbn};
	var projectionObject = {title : _title, description:_description,isbn:_isbn}

	BookDetail.updateOne(selectionObject,projectionObject,function(err,result){

		if(err)
		{
			return res.send({message:"Oops something went wrong!!!",msgTye : "E"}).status(500);
		}
		else
		{
			if(result.n == 1)
			{
				return res.send({message : "Data updated successfully !!!",msgtype : "S",Data:result}).status(201);
			}
			else
			{
				return res.send({message : "No data available!!!",msgtype : "S",Data:result}).status(400);
			}
		}
	});
}