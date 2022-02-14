const bodyParser = require('body-parser')
const express = require ('express')

const app = express();
app.use(bodyParser.urlencoded({extended:true}))

app.use(bodyParser.json())

const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.url,{useNewUrlParser:true})
    .then(() => {
        console.log("Connection Successful!");
    }).catch(err=>{
        console.log("Error Creating Connection: "+err);

    });

app.get('/',(req,res)=>{
    res.json({"message":"API server is up & running"})
});

require('./app/routes/note.route.js')(app)

app.listen(3000,()=>{
    console.log("Server is started on port 3000.")
})