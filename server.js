'use strict';

const express = require('express');
const pg = require('pg');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;
const conString = 'postgres://localhost:5432';
const client = new pg.Client(conString);
client.connect();
client.on('error', err => {
  console.error(err);
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('.'));

app.get('/test', (request, response) => response.send('Hello world.'));
app.get('*', (request,response) => response.send('404'));


app.listen(PORT, () => console.log(`Server started on port ${PORT}!`));
