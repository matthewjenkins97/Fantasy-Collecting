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
  if (!req.body.title) {
    res.sendStatus(400);
  }

  let identifier = req.body.title;
  identifier = identifier.replace(/\s/, '');
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
      dbEntry[i] = `'${dbEntry[i]}'`;
    } else if (dbEntry[i] == undefined) {
      dbEntry[i] = `NULL`;
    }
  }

  const dbEntryArgs = dbEntry.join(', ');

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
  const dbEntry = {
    'title': req.body.title,
    'artist': req.body.artist,
    'year': req.body.year,
    'theoreticalprice': req.body.theoreticalprice,
    'actualprice': req.body.actualprice,
    'hidden': req.body.hidden,
    'owner': req.body.owner,
    'url': req.body.url,
  };

  for (const item of Object.keys(dbEntry)) {
    if (dbEntry[item] != undefined) {
      if (typeof(dbEntry[item]) == 'string') {
        connection.query(`UPDATE artworks SET ${item} = '${dbEntry[item]}' WHERE identifier = '${req.params.id}'`);
      } else {
        connection.query(`UPDATE artworks SET ${item} = ${dbEntry[item]} WHERE identifier = '${req.params.id}'`);
      }
    }
  }

  res.sendStatus(200);
});

router.delete('/:id', function(req, res, next) {
  connection.query(`DELETE FROM artworks WHERE identifier = '${req.params.id}'`, (err, results, fields) => {
    res.sendStatus(200);
  });
});

module.exports = router;
