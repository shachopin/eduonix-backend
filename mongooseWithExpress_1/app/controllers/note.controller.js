const Note = require('../models/note.model.js')

exports.create = (req,res) =>{
    if(!req.body.content){
        return res.status(400).send({
            "message":"Request Content cannot be blank."
        });
    }
    const note= new Note({
        title: req.body.title ||"Note-Sample",
        content:req.body.content,
        userName:req.body.userName
    });

    note.save()
        .then(data =>{
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message:err.message
            });
        });
};

exports.findAll = (req,res) =>{
    Note.find({userName:req.params.userName})
    .then(notes =>{
        res.send(notes);
    })
    .catch(err => {
        res.status(500).send({
            message:err.message
        });
    });
};

exports.findById = (req,res) =>{
    Note.findById(req.params.noteId)
    .then(note =>{
        if(!note){
            return res.status(404).send({
                message:"Notes are not available for the Id:"+req.params.noteId
            });
        }
        res.send(note);
    })
    .catch(err => {
        res.status(500).send({
            message:err.message
        });
    });
};

exports.findByTitle = (req,res) =>{
    Note.findOne({"title" : req.params.title})
    .then(note =>{
        if(!note){
            return res.status(404).send({
                message:"Notes are not available for the title:"+req.params.title
            });
        }
        res.send(note);
    })
    .catch(err => {
        res.status(500).send({
            message:err.message
        });
    });
};

exports.update = (req,res) =>{

    if(!req.body.content){
        return res.status(400).send({
            "message":"Request Content cannot be blank."
        });
    }

    Note.findByIdAndUpdate(req.params.noteId,{
        title:req.body.title||"Note-Sample",
        content:req.body.content
    })
    .then(note => {
        if(!note){
            return res.status(404).send({
                message:"Notes are not available for the Id:"+req.params.noteId
            });   
        }
        res.send(note);
    }).catch(err =>{
        return res.status(500).send({
            message:err.message
        }); 
    });
};


exports.delete = (req,res) =>{

    Note.findByIdAndDelete(req.params.noteId)
    .then(note => {
        if(!note){
            return res.status(404).send({
                message:"Notes are not available for the Id:"+req.params.noteId
            });   
        }
        res.send({message:"Note Deleted Successfully"});
    }).catch(err =>{
        return res.status(500).send({
            message:err.message
        }); 
    });
};