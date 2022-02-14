const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookSchema = new Schema({
    title: String,
    description: String,
    publisher: String,
    bookType: {
        type: String,
        enum: ["ebook", "hardcopy"],
        default: "hardcopy",
    },
    stock: Number,
    language: String,
    printedOn: Date,
    authorName: String
});

const Book = mongoose.model('Book', bookSchema);

const addNewBook = function(data, callback){
    const book = new Book(data);
    book.save(function(error, result){
        if(error){
            return callback(error);
        }
        return callback(null, result);
    })
};

const isBookAvailable = function(bookId, callback){
    Book.findOne(bookId).select("stock").exec(function(error, result){
        if(error){
            return callback(error);
        }
        const availability = result.stock > 0 ? true: false;
        return callback(null, availability);
    });
}

module.exports = {
    addNewBook,
    isBookAvailable,
};