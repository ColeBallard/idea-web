const notes = require('./notes.json');
const path = require('path');
const fs = require('fs');

const setJSON = data => {
  fs.writeFileSync('notes.json', JSON.stringify(data));
};

module.exports = (app) => {

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });

  app.get('/api/notes', (req, res) => res.json(notes));

  app.get('/api/notes/:title', (req, res) => {
    const note = notes.find(note => note.title === req.params.title);

    if (!note) return res.json(false);
    else return res.json(note);
  });

  app.post('/api/notes', (req, res) => {
    notes.push(req.body);
    setJSON(notes);
  });

  app.delete('/api/notes/:title', (req, res) => {
    notes.splice(notes.findIndex(note => note.title === req.params.title), 1);
    setJSON(notes);
  });
};
