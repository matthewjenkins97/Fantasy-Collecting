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
  connection.query('SELECT * FROM microresearch', (err, results, fields) => {
    res.send(results);
  });
});

router.get('/:id', function(req, res, next) {
  connection.query(`SELECT * FROM microresearch WHERE username = '${req.params.id}' or identifier = '${req.params.id}'`, (err, results, fields) => {
    res.send(results);
  });
});

router.post('/', json(), function(req, res, next) {
  if (!req.body.username || !req.body.identifier) {
    res.sendStatus(400);
  } else {
    // timestamp (corresponding to our datetime object) needs to be converted
    // to something mysql can accept
    req.body.timestamp = new Date(req.body.timestamp).toISOString().slice(0, 19).replace('T', ' ');

    const dbEntry = [
      req.body.username,
      req.body.identifier,
      req.body.information,
      req.body.timestamp,
    ];

    for (const i in dbEntry) {
      if (typeof(dbEntry[i]) === 'string') {
        dbEntry[i] = `'${dbEntry[i]}'`;
      } else if (dbEntry[i] == undefined) {
        dbEntry[i] = `NULL`;
      }
    }

    const dbEntryArgs = dbEntry.join(', ');

    connection.query(`INSERT INTO microresearch VALUES (${dbEntryArgs})`, (err, results, fields) => {
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
