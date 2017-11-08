'use strict';

// app dependencies
const express = require('express');
const pg = require('pg');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');
const page = require('page');

// app setup
const app = express();
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

// database setup
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

// middleware
app.use(page());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// api endpoints
// When the client (view) makes an Ajax call to /api/v1/books, returns all results except for the description.
app.get('/api/v1/books', (request, response) => {
  client.query(`
    SELECT book_id, title, author, image_url, isbn FROM books;`
  )
    .then(results => response.send(results.rows))
    .catch(console.error);
});

app.get('/api/v1/books/:id', (request, response) => {
  client.query(`
    SELECT book_id, title, author, image_url, isbn FROM books
    WHERE book_id = $1`,
    [request.body.book_id]
  )
    .then(results => response.send(results.rows))
    .catch(console.error);
});


app.post('api/v1/books'), (request, response) => {
  client.query(`
    INSERT INTO books(title, author, image_url, isbn, description)
    VALUES($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`,
    [request.body.title, request.body.author, request.body.image_url, request.body.isbn, request.body.description],
    function(err) {
      if(err) console.error(err);
    }
  )
}

app.get('/*', (req, res) => res.redirect(CLIENT_URL));

loadDB();

app.listen(PORT, () => console.log(`Server started on port ${PORT}!`));

function loadBooks() {
  console.log('loadBooks');
  client.query('SELECT COUNT(*) FROM books')
    .then(result => {
      if(!parseInt(result.rows[0].count)) {
        fs.readFile(`${CLIENT_URL}/data/books.json`, (err, fd) => {
          JSON.parse(fd.toString()).forEach(ele => {
            client.query(`
            INSERT INTO
            books(title, author, image_url, isbn, description)
            SELECT $1, $2, $3, $4, $5
            `,
              [ele.title, ele.author, ele.image_url, ele.isbn, ele.description]
            )
              .catch(console.error);
          })
        })
      }
    })
}

function loadDB() {
  console.log('loadDB');
  // client.query(`
  //   CREATE TABLE IF NOT EXISTS
  //   books (
  //     book_id SERIAL PRIMARY KEY,
  //     title VARCHAR(255) NOT NULL,
  //     author VARCHAR(255) NOT NULL,
  //     image_url TEXT,
  //     isbn TEXT,
  //     description TEXT
  //   );`
  // )
  //   .then(loadBooks)
  //   .catch(console.error)
}
