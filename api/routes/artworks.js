const express = require('express');
const router = express.Router();

const {json} = require('body-parser');
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'fantasy_collecting',
});

router.get('/', function(req, res, next) {
  connection.query('SELECT * FROM artworks', (err, results, fields) => {
    res.send(results);
  });
});

router.get('/:id', function(req, res, next) {
  connection.query(`SELECT * FROM artworks WHERE identifier = '${req.params.id}'`, (err, results, fields) => {
    res.send(results);
  });
});

router.post('/', json(), function(req, res, next) {
  // create identifier
  let identifier = req.body.title + req.body.artist;
  identifier = identifier.replace(/\s/g, '');
  identifier = identifier.toLowerCase();
  identifier = identifier.substr(0, 20);

  const dbEntry = [
    identifier,
    req.body.title,
    req.body.artist,
    req.body.year,
    req.body.theoreticalprice,
    req.body.actualprice,
    req.body.hidden,
    req.body.owner,
    req.body.url,
  ];

  for (const i in dbEntry) {
    if (typeof(dbEntry[i]) === 'string') {
      dbEntry[i] = '\'' + dbEntry[i] + '\'';
    } else if (dbEntry[i] == undefined) {
      dbEntry[i] = `NULL`;
    }
  }

  const dbEntryArgs = dbEntry.join(', ');
  console.log(dbEntryArgs);

  connection.query(`INSERT INTO artworks VALUES (${dbEntryArgs})`, (err, results, fields) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});

router.put('/:id', json(), function(req, res, next) {
  res.send('PUT /artworks/' + req.params.id);
});

router.delete('/:id', function(req, res, next) {
  res.send('DELETE /artworks/' + req.params.id);
});

module.exports = router;
