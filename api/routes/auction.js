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
  if (!req.body.number) {
    res.sendStatus(400);
  } else {
    const dbEntry = [
      req.body.number,
      req.body.identifier,
    ];

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
    'number': req.body.number,
    'identifier': req.body.identifier,
  };

  for (const item of Object.keys(dbEntry)) {
    if (dbEntry[item] != undefined) {
      if (typeof(dbEntry[item]) == 'string') {
        connection.query(`UPDATE auction SET ${item} = '${dbEntry[item]}' WHERE number = '${req.params.id}'`);
      } else {
        connection.query(`UPDATE auction SET ${item} = ${dbEntry[item]} WHERE number = '${req.params.id}'`);
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
