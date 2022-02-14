const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    userName:String,
    email:String,
    name:String
},{
   timestamps: true 
});

module.exports = mongoose.model('User',UserSchema);