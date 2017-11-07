'use strict';

const express = require('express');
const pg = require('pg');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT;

const CLIENT_URL = process.env.CLIENT_URL;

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));
app.use(cors());

app.get('/', (request, response) => {
  console.log(CLIENT_URL);
  response.sendFile('index.html', {root: CLIENT_URL})
});

app.get('/test', (request, response) => response.send('Hello world.'));
app.get('/*', (req, res) => res.send('404'));


app.get('/api/v1/books', (request, response) => {
  client.query(`
    SELECT book_id, title, author, image_url FROM books;`
  )
  .then(console.log(result))
  .catch(console.error);
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}!`));
