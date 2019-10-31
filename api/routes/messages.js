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
  connection.query('SELECT * FROM messages', (err, results, fields) => {
    res.send(results);
  });
});

router.get('/:id', function(req, res, next) {
  connection.query(`SELECT * FROM messages WHERE sender = '${req.params.id}'`, (err, results, fields) => {
    res.send(results);
  });
});

router.post('/', json(), function(req, res, next) {
  // primary key check - if it doesn't exist, it's a bad request
  if (!req.body.sender) {
    res.sendStatus(400);
  } else {
    const dbEntry = [
      req.body.sender,
      req.body.receiver,
      req.body.message,
      req.body.timestamp,
    ];

    // dbEntry[3] (corresponding to our datetime object) needs to be converted
    // to something mysql can accept
    dbEntry[3] = new Date(dbEntry[3]).toISOString().slice(0, 19).replace('T', ' ');

    for (const i in dbEntry) {
      if (typeof(dbEntry[i]) === 'string') {
        dbEntry[i] = `'${dbEntry[i]}'`;
      }
    }

    const dbEntryArgs = dbEntry.join(', ');

    connection.query(`INSERT INTO messages VALUES (${dbEntryArgs})`, (err, results, fields) => {
      if (err) {
        console.error(err);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });
  }
});

module.exports = router;
