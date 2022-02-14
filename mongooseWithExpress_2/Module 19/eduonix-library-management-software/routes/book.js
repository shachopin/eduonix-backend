var express = require('express');
const { addNewBook } = require('../models/Book');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/',function(req, res){
    addNewBook(req.body, function(error, result){
      if(error){
        res.status(500).send({
          success: false,
          message: error.message
        });
        return;
      }
      res.status(200).send({
        success: true,
        message: "Added New Book!!",
        data: result
      });
    });
});

module.exports = router;
