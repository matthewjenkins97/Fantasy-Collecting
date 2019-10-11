const express = require('express');
const router = express.Router();

const {json} = require('body-parser');
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'fantasyc_user',
  password: 'o6UZMvPZas0H',
  database: 'fantasyc_database',
});

router.get('/', function(req, res, next) {
  connection.query('SELECT * FROM users', (err, results, fields) => {
    res.send(results);
  });
});

router.get('/:id', function(req, res, next) {
  connection.query(`SELECT * FROM users WHERE username = '${req.params.id}'`, (err, results, fields) => {
    res.send(results);
  });
});

router.post('/', json(), function(req, res, next) {
  // primary key check - if it doesn't exist, it's a bad request
  if (!req.body.username) {
    res.sendStatus(400);
  } else {
    const dbEntry = [
      req.body.username,
      req.body.hash,
      req.body.name,
      req.body.admin,
      req.body.guilders,
      req.body.microresearchpoints,
      req.body.numofpaintings,
    ];

    for (const i in dbEntry) {
      if (typeof(dbEntry[i]) === 'string') {
        dbEntry[i] = `'${dbEntry[i]}'`;
      } else if (dbEntry[i] == undefined) {
        dbEntry[i] = `NULL`;
      }
    }

    const dbEntryArgs = dbEntry.join(', ');

    connection.query(`INSERT INTO users VALUES (${dbEntryArgs})`, (err, results, fields) => {
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
    'hash': req.body.hash,
    'name': req.body.name,
    'admin': req.body.admin,
    'guilders': req.body.guilders,
    'microresearchpoints': req.body.microresearchpoints,
    'numofpaintings': req.body.numofpaintings,
  };

  for (const item of Object.keys(dbEntry)) {
    if (dbEntry[item] != undefined) {
      if (typeof(dbEntry[item]) == 'string') {
        connection.query(`UPDATE users SET ${item} = '${dbEntry[item]}' WHERE username = '${req.params.id}'`);
      } else {
        connection.query(`UPDATE users SET ${item} = ${dbEntry[item]} WHERE username = '${req.params.id}'`);
      }
    }
  }

  res.sendStatus(200);
});

router.delete('/:id', function(req, res, next) {
  connection.query(`DELETE FROM users WHERE username = '${req.params.id}'`, (err, results, fields) => {
    res.sendStatus(200);
  });
});

module.exports = router;
