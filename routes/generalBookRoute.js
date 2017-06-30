//included express library
var express = require('express');
var router = express.Router();

//included generalcontroller files
var genBookController = require('../controllers/generalBookController');

//request process without token validation
router.post('/createuser', genBookController.createUser);
router.post('/login',genBookController.login);

//Authenticate token before below request
router.use('/*',genBookController.authenticateToken);

//request process with token validation
router.get('/getallbook',genBookController.getAllBook);
router.post('/createbook',genBookController.createBook);
router.post('/getbookbyid',genBookController.getBookById);
router.delete('/deletebybookid/:bookid',genBookController.deleteByBookId);
router.post('/updatebookbybookid',genBookController.updateBookByBookId);

module.exports = router;