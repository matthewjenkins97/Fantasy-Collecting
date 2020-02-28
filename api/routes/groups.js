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
  connection.execute('SELECT * FROM groups', (err, results, fields) => {
    res.send(results);
  });
});

router.get('/:id', function(req, res, next) {
  connection.execute(`SELECT * FROM groups WHERE groupid = ?`, [req.params.id], (err, results, fields) => {
    res.send(results);
  });
});

router.post('/', json(), function(req, res, next) {
  // primary key check - if it doesn't exist, it's a bad request
  if (!req.body.identifier) {
    res.sendStatus(400);
  } else {
    //req.body.date
    // date (corresponding to our datetime object) needs to be converted
    // to something mysql can accept
    req.body.date = new Date(req.body.date).toISOString().slice(0, 19).replace('T', ' ');

    const dbEntry = [
      req.body.groupid,
      req.body.identifier,
      req.body.date,
      req.body.allowstudents,
      req.body.archived,
    ];

    for (const i in dbEntry) {
      if (dbEntry[i] == undefined) {
        dbEntry[i] = null;
      }
    }

    connection.execute(`INSERT INTO groups VALUES (?, ?, ?, ?, ?)`, dbEntry, (err, results, fields) => {
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
  // date (corresponding to our datetime object) needs to be converted
  // to something mysql can accept
  if (req.body.date !== undefined) {
    req.body.date = new Date(req.body.date).toISOString().slice(0, 19).replace('T', ' ');
  }

  const dbEntry = {
    identifier: req.body.identifier,
    date: req.body.date,
    allowstudents: req.body.allowstudents,
    archived: req.body.archived,
  };

  for (const item of Object.keys(dbEntry)) {
    if (dbEntry[item] !== undefined) {
      connection.execute(`UPDATE groups SET ${item} = ? WHERE groupid = ?`, [dbEntry[item], req.params.id]);
    }
  }

  res.sendStatus(200);
});

router.delete('/:id', function(req, res, next) {
  connection.execute(`DELETE FROM groups WHERE groupid = ?`, [req.params.id], (err, results, fields) => {
    res.sendStatus(200);
  });
});

module.exports = router;
