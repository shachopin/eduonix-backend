const mongoose = require('mongoose');
const { Schema } = mongoose;

const authorSchema = new Schema({
     firstname: String,
     lastname: String,
     books:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
    }]
});

const Author = mongoose.model('Author', authorSchema);
const addNewAuthor = function(data, callback){
    const author = new Author({
        ...data
    });
    author.save(function(error, result){
        if(error){
            console.error("Error Occured while Saving Author", error.message);
            return callback(error);
        }
        return callback(null, result);
    });
}
const getAllBooksWrittenByAuthor=function(authorId, callback){
    Author.findById(authorId).populate('books').exec(function(error, result){
        if(error){
            console.error("Error Occured while Fetching Author's Book", error.message);
            return callback(error);
        }
        return callback(null, result);
    });
};
const addNewBookToAuthor = function(bookId, authorId, callback){
    Author.findByIdAndUpdate(authorId, { books: bookId }, function(error, data){
        if(error){ 
            return callback(error);
        }
        return callback(null, data);
    });
}
module.exports = {
    addNewAuthor,
    getAllBooksWrittenByAuthor,
    addNewBookToAuthor
}