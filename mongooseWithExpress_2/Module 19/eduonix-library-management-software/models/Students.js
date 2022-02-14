const mongoose = require('mongoose');
const { Schema } = mongoose;

const studentSchema = new Schema({
    firstname:String,
    lastName: String,
    email: String,
    mobile: String,
    authorized: Boolean,
    transactions:[{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction"
    }]
});

const Student = mongoose.model('Student', studentSchema);