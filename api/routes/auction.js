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
  connection.execute('SELECT * FROM auction', (err, results, fields) => {
    res.send(results);
  });
});

router.get('/:id/:num', function(req, res, next) {
  connection.execute('SELECT * FROM auction WHERE identifier = ? and number = ?', [req.params.id, req.params.num], (err, results, fields) => {
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
    req.body.deadline = new Date(req.body.deadline).toISOString().slice(0, 19).replace('T', ' ');

    const dbEntry = [
      req.body.identifier,
      req.body.number,
      req.body.highestbid,
      req.body.username,
      req.body.deadline,
      req.body.groupid,
      req.body.lotessay,
      req.body.pricevisible,
      req.body.sold
    ];

    for (const i in dbEntry) {
      if (dbEntry[i] === undefined) {
        dbEntry[i] = null;
      }
    }

    connection.execute(`INSERT INTO auction VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, dbEntry, (err, results, fields) => {
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
  // deadline (corresponding to our datetime object) needs to be converted
  // to something mysql can accept
  if (req.body.deadline !== undefined) {
    req.body.deadline = new Date(req.body.deadline).toISOString().slice(0, 19).replace('T', ' ');
  }
  
  const dbEntry = {
    number: req.body.number,
    highestbid: req.body.highestbid,
    username: req.body.username,
    deadline: req.body.deadline,
    groupid: req.body.groupid,
    lotessay: req.body.lotessay,
    pricevisible: req.body.pricevisible,
    sold: req.body.sold
  };

  for (const item of Object.keys(dbEntry)) {
    if (dbEntry[item] !== undefined) {
      connection.execute(`UPDATE auction SET ${item} = ? WHERE identifier = ?`, [dbEntry[item], req.params.id]);
    }
  }

  res.sendStatus(200);
});

router.delete('/:id', function(req, res, next) {
  connection.execute(`DELETE FROM auction WHERE identifier = ?`, [req.params.id], (err, results, fields) => {
    res.sendStatus(200);
  });
});

module.exports = router;
