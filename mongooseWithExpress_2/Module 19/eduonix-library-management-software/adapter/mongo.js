const mongoose = require('mongoose');
const connectToDB = ()=>{
    //const URL = mongodb://{username}:{password}@{server-address}:{port}/{db};
    const URL = 'mongodb://localhost:27017/eduonix-library';
    mongoose.connect(URL);
    const db = mongoose.connection;
    db.on('connected', function(){
        console.log("Connected to the Database", URL);
    });
    db.on('error', function(error){
        console.error("MongoDB connection errored", error.message);
    });
}
module.exports = connectToDB;