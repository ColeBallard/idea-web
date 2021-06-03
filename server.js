const express = require('express');

const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use('/scripts', express.static(__dirname + '/node_modules/@panzoom/panzoom/dist/'));

require('./routes')(app);

app.listen(PORT, () => {
  console.log(`App listening on http://localhost:${PORT}/.`);
});
