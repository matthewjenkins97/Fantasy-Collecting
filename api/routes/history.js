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
  connection.execute('SELECT * FROM history', (err, results, fields) => {
    res.send(results);
  });
});

router.get('/:id', function(req, res, next) {
  connection.execute(`SELECT * FROM history WHERE identifier = ?`, [req.params.id], (err, results, fields) => {
    res.send(results);
  });
});

router.post('/', json(), function(req, res, next) {
  // primary key check - if it doesn't exist, it's a bad request
  if (!req.body.identifier) {
    res.sendStatus(400);
  } else {
    // timestamp (corresponding to our datetime object) needs to be converted
    // to something mysql can accept
    req.body.timestamp = new Date(req.body.timestamp).toISOString().slice(0, 19).replace('T', ' ');

    const dbEntry = [
      req.body.identifier,
      req.body.seller,
      req.body.buyer,
      req.body.price,
      req.body.timestamp,
      req.body.tradeid,
    ];

    for (const i in dbEntry) {
      if (dbEntry[i] === undefined) {
        dbEntry[i] = null;
      }
    }

    connection.query(`INSERT INTO history VALUES (?, ?, ?, ?, ?, ?)`, dbEntry, (err, results, fields) => {
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
  // timestamp (corresponding to our datetime object) needs to be converted
  // to something mysql can accept
  if (req.body.timestamp !== undefined) {
    req.body.timestamp = new Date(req.body.timestamp).toISOString().slice(0, 19).replace('T', ' ');
  }

  const dbEntry = {
    seller: req.body.seller,
    buyer: req.body.buyer,
    price: req.body.price,
    timestamp: req.body.timestamp,
    tradeid: req.body.tradeid,
  };

  for (const item of Object.keys(dbEntry)) {
    if (dbEntry[item] !== undefined) {
      connection.execute(`UPDATE history SET ${item} = ? WHERE identifier = ?`, [dbEntry[item], req.params.id]);
    }
  }

  res.sendStatus(200);
});

router.delete('/:id', function(req, res, next) {
  connection.execute(`DELETE FROM history WHERE identifier = ?`, [req.params.id], (err, results, fields) => {
    res.sendStatus(200);
  });
});


module.exports = router;
