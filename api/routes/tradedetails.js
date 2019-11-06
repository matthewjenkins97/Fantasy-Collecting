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
  connection.query('SELECT * FROM tradedetails', (err, results, fields) => {
    res.send(results);
  });
});

router.get('/:id', function(req, res, next) {
  connection.query(`SELECT * FROM tradedetails WHERE seller = '${req.params.id}'`, (err, results, fields) => {
    res.send(results);
  });
});

router.post('/', json(), function(req, res, next) {
  // primary key check - if it doesn't exist, it's a bad request
  if (!req.body.seller) {
    res.sendStatus(400);
  } else {
    const dbEntry = [
      req.body.tradeid,
      req.body.buyer,
      req.body.seller,
      req.body.offer,
      req.body.approved,
    ];

    for (const i in dbEntry) {
      if (typeof(dbEntry[i]) === 'string') {
        dbEntry[i] = `'${dbEntry[i]}'`;
      } else if (dbEntry[i] == undefined) {
        dbEntry[i] = `NULL`;
      }
    }

    const dbEntryArgs = dbEntry.join(', ');

    connection.query(`INSERT INTO tradedetails VALUES (${dbEntryArgs})`, (err, results, fields) => {
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
    buyer: req.body.buyer,
    seller: req.body.seller,
    offer: req.body.offer,
    approved: req.body.approved,
  };

  for (const item of Object.keys(dbEntry)) {
    if (dbEntry[item] != undefined) {
      if (typeof(dbEntry[item]) == 'string') {
        connection.query(`UPDATE tradedetails SET ${item} = '${dbEntry[item]}' WHERE tradeid = '${req.params.id}'`);
      } else {
        connection.query(`UPDATE tradedetails SET ${item} = ${dbEntry[item]} WHERE tradeid = '${req.params.id}'`);
      }
    }
  }

  res.sendStatus(200);
});

router.delete('/:id', function(req, res, next) {
  connection.query(`DELETE FROM tradedetails WHERE tradeid = '${req.params.id}'`, (err, results, fields) => {
    res.sendStatus(200);
  });
});

module.exports = router;