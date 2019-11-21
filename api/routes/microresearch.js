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
  connection.execute('SELECT * FROM microresearch', (err, results, fields) => {
    res.send(results);
  });
});

router.get('/:id', function(req, res, next) {
  connection.execute(`SELECT * FROM microresearch WHERE identifier = ?`, [req.params.id], (err, results, fields) => {
    res.send(results);
  });
});

router.post('/', json(), function(req, res, next) {
  if (!req.body.identifier) {
    res.sendStatus(400);
  } else {

    const dbEntry = [
      req.body.username,
      req.body.identifier,
      req.body.information,
      req.body.timestamp,
    ];

    // setting nonexistent things to null
    for (let i in dbEntry) {
      if (dbEntry[i] === undefined) {
        dbEntry[i] = null;
      }
    }

    connection.execute('INSERT INTO microresearch VALUES (?, ?, ?, ?)', dbEntry, (err, results, fields) => {
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
