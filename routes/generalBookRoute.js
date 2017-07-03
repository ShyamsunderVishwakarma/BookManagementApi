//included express library
var express = require('express');
var router = express.Router();

//included generalcontroller files
var genBookController = require('../controllers/generalBookController');

//include middleware file
var isAuthenticate = require('../middlewares/generalMiddleware');

//request process without token validation
router.post('/user', genBookController.createUser);
router.post('/login',genBookController.login);

//request process with token validation
router.get('/book',isAuthenticate.authenticateToken,genBookController.getAllBook);
router.post('/book',isAuthenticate.authenticateToken,genBookController.createBook);
router.get('/book/:isbn',isAuthenticate.authenticateToken,genBookController.getBookById);
router.delete('/book/:isbn',isAuthenticate.authenticateToken,genBookController.deleteByBookId);
router.put('/book/:isbn',isAuthenticate.authenticateToken,genBookController.updateBookByBookId);

module.exports = router;