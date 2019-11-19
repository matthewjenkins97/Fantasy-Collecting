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
  connection.query('SELECT * FROM auction', (err, results, fields) => {
    res.send(results);
  });
});

router.post('/', json(), function(req, res, next) {
  // primary key check - if it doesn't exist, it's a bad request
  if (!req.body.udebtufuer) {
    res.sendStatus(400);
  } else {
    const dbEntry = [
      req.body.identifier,
      req.body.number,
      req.body.highestbid,
      req.body.username,
      req.body.deadline
    ];

    // dbEntry[4] (corresponding to our datetime object) needs to be converted to something mysql can accept
    dbEntry[4] = new Date(dbEntry[4]).toISOString().slice(0, 19).replace('T', ' ');

    for (const i in dbEntry) {
      if (typeof(dbEntry[i]) === 'string') {
        dbEntry[i] = `'${dbEntry[i]}'`;
      } else if (dbEntry[i] == undefined) {
        dbEntry[i] = `NULL`;
      }
    }

    const dbEntryArgs = dbEntry.join(', ');

    connection.query(`INSERT INTO auction VALUES (${dbEntryArgs})`, (err, results, fields) => {
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
    number: req.body.number,
    highestbid: req.body.highestbid,
    username: req.body.username,
    deadline: req.body.deadline
  };

  dbEntry.timestamp = new Date(dbEntry.timestamp).toISOString().slice(0, 19).replace('T', ' ');

  for (const item of Object.keys(dbEntry)) {
    if (dbEntry[item] != undefined) {
      if (typeof(dbEntry[item]) == 'string') {
        connection.query(`UPDATE auction SET ${item} = '${dbEntry[item]}' WHERE identifier = '${req.params.id}'`);
      } else {
        connection.query(`UPDATE auction SET ${item} = ${dbEntry[item]} WHERE identifier = '${req.params.id}'`);
      }
    }
  }

  res.sendStatus(200);
});

router.delete('/:id', function(req, res, next) {
  connection.query(`DELETE FROM auction WHERE number = '${req.params.id}'`, (err, results, fields) => {
    res.sendStatus(200);
  });
});

module.exports = router;
