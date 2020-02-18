const express = require('express');
const router = express.Router();

const {json} = require('body-parser');
const mysql = require('mysql2');

const connection = mysql.createPool({
  host: 'localhost',
  user: 'fantasyc_user',
  password: 'o6UZMvPZas0H',
  database: 'fantasyc_database',
});

router.get('/', function(req, res, next) {
  connection.execute('SELECT * FROM artworks', (err, results, fields) => {
    res.send(results);
  });
});

router.get('/:id', function(req, res, next) {
  connection.execute(`SELECT * FROM artworks WHERE identifier = ?`, [req.params.id], (err, results, fields) => {
    res.send(results);
  });
});

router.post('/', json(), function(req, res, next) {
  // primary key check - if it doesn't exist, it's a bad request
  if (!req.body.identifier) {
    res.sendStatus(400);
  } else {

    const dbEntry = [
      req.body.identifier,
      req.body.title,
      req.body.artist,
      req.body.year,
      req.body.theoreticalprice,
      req.body.actualprice,
      req.body.owner,
      req.body.url,
      req.body.rateable,
    ];

    for (const i in dbEntry) {
      if (dbEntry[i] === undefined) {
        dbEntry[i] = null;
      }
    }

    connection.execute(`INSERT INTO artworks VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, dbEntry, (err, results, fields) => {
      if (err) {
        console.error(err);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });
  }
});

router.put('/:id', json(), function(req, res, next) {
  const dbEntry = {
    identifier: req.body.identifier,
    title: req.body.title,
    artist: req.body.artist,
    year: req.body.year,
    theoreticalprice: req.body.theoreticalprice,
    actualprice: req.body.actualprice,
    owner: req.body.owner,
    url: req.body.url,
    rateable: req.body.rateable,
  };

  for (const item of Object.keys(dbEntry)) {
    if (dbEntry[item] !== undefined) {
      connection.execute(`UPDATE artworks SET ${item} = ? WHERE identifier = ?`, [dbEntry[item], req.params.id]);
    }
  }

  res.sendStatus(200);
});

router.delete('/:id', function(req, res, next) {
  connection.execute(`DELETE FROM artworks WHERE identifier = ?`, [req.params.id], (err, results, fields) => {
    res.sendStatus(200);
  });
});

module.exports = router;
