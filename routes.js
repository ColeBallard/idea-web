const path = require('path');
const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection(process.env.JAWSDB_URL);
connection.connect();

module.exports = app => {

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });

  app.get('/api/web', (req, res) => {
    connection.query('SELECT * FROM bubbles', (err, rows, fields) => {
      if (err) throw err;

      res.json(rows);
    });
  });
  
};
