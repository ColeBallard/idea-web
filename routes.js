const noteData = require('./noteData');
const path = require('path');

module.exports = (app) => {

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });

  app.get('/api/notes', (req, res) => res.json(noteData));

  app.get('/api/notes/:title', (req, res) => {
    const note = noteData.find(note => note.title === req.params.title);

    if (!note) 
      return res.json(false);
    else
      return res.json(note);
  });

  app.post('/api/notes', (req, res) => {
    noteData.push(req.body);
  });

  app.delete('/api/notes/:title', (req, res) => {
    noteData = filter(note => { return note.title !== req.params.title });
  });
};
