module.exports = (app) =>{

    const notes = require('../controllers/note.controller.js');
    const users = require('../controllers/users.controller.js');

    app.post('/notes/create',notes.create);
    app.get('/notes/fetch/:userName',notes.findAll);
    app.get('/notes/fetch/:noteId',notes.findById);
    app.get('/notes/search/:title',notes.findByTitle);
    app.put('/notes/update/:noteId',notes.update);
    app.delete('/notes/delete/:noteId',notes.delete);


    app.post('/users/create',users.create);

}