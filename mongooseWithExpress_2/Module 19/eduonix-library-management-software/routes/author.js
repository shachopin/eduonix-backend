var express = require('express');
const { addNewAuthor, getAllBooksWrittenByAuthor, addNewBookToAuthor } = require('../models/Author');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/',function(req, res){
    addNewAuthor(req.body, function(error, result){
        if(error){
          res.status(500).send({
            success: false,
            message: error.message
          });
          return;
        }
        res.status(200).send({
          success: true,
          message: "Added New Author!!",
          data: result
        });
      });
});

router.get('/allBooks/:authorId', function(req, res){
    getAllBooksWrittenByAuthor(req.params.authorId,function(error, result){
        if(error){
          res.status(500).send({
            success: false,
            message: error.message
          });
          return;
        }
        res.status(200).send({
          success: true,
          message: "Books Written By Author!!",
          data: result
        });
      })
});

router.put('/addNewBookToAuthor/:bookId/:authorId', function(req, res){
    const { bookId, authorId } = req.params;
    addNewBookToAuthor(bookId,authorId,function(error, result){
        if(error){
          res.status(500).send({
            success: false,
            message: error.message
          });
          return;
        }
        res.status(200).send({
          success: true,
          message: "Added New Book to Author!!",
          data: result
        });
      })
})
module.exports = router;
