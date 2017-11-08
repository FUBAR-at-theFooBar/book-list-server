'use strict';

// app dependencies
const express = require('express');
const pg = require('pg');
const cors = require('cors');

// app setup
const app = express();
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

// database setup
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

// middleware
app.use(cors());

// api endpoints
app.get('/*', (req, res) => res.redirect(CLIENT_URL));

// When the client (view) makes an Ajax call to /api/v1/books, returns all results except for the description.
app.get('/api/v1/books', (request, response) => {
  client.query(`
    SELECT book_id, title, author, image_url, isbn FROM books;`
  )
  .then(results => response.send(results.rows))
  .catch(console.error);
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}!`));
