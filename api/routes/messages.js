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
  connection.execute('SELECT * FROM messages', (err, results, fields) => {
    res.send(results);
  });
});

router.get('/:id', function(req, res, next) {
  connection.execute(`SELECT * FROM messages WHERE username = ?`, [req.params.id], (err, results, fields) => {
    res.send(results);
  });
});

router.get('/:id/:room', function(req, res, next) {
  connection.execute(`SELECT * FROM messages WHERE username = ? AND room = ?`, [req.params.id, req.params.room], (err, results, fields) => {
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
      req.body.room,
      req.body.messagecount,
    ];

    for (const i in dbEntry) {
      if (dbEntry[i] === undefined) {
        dbEntry[i] = null;
      }
    }

    connection.execute(`INSERT INTO messages VALUES (?, ?, ?)`, dbEntry, (err, results, fields) => {
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
    username: req.body.username,
    room: req.body.room,
    messagecount: req.body.messagecount,
  };

  for (const item of Object.keys(dbEntry)) {
    if (dbEntry[item] !== undefined) {
      connection.execute(`UPDATE messages SET ${item} = ? WHERE username = ?`, [dbEntry[item], req.params.id]);
    }
  }

  res.sendStatus(200);
});

router.put('/:id/:room', json(), function(req, res, next) {
  const messagecount = req.body.messagecount;
  connection.execute(`UPDATE messages SET messagecount = ? WHERE username = ? AND room = ?`, [messagecount, req.params.id, req.params.room]);
  res.sendStatus(200);
});

router.delete('/:id', function(req, res, next) {
  connection.execute(`DELETE FROM messages WHERE username = ?`, [req.params.id], (err, results, fields) => {
    res.sendStatus(200);
  });
});

module.exports = router;
