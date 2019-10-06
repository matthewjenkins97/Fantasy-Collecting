const express = require('express');
const router = express.Router();

const {json} = require('body-parser');
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'fantasy_collecting',
});

const expectedPOSTParameters = [];
const expectedPUTParameters = [];

router.get('/', function(req, res, next) {
  connection.query('SELECT * FROM students', (err, results, fields) => {
    res.send(results);
  });
});

router.get('/:id', function(req, res, next) {
  connection.query(`SELECT * FROM students WHERE username = ${req.params.id}`, (err, results, fields) => {
    res.send(results);
  });
});

router.post('/', json(), function(req, res, next) {
  console.log(req.body);
  res.send('POST /students/' + req.params.id);
});

router.put('/:id', json(), function(req, res, next) {
  res.send('PUT /students/' + req.params.id);
});

router.delete('/:id', function(req, res, next) {
  res.send('DELETE /students/' + req.params.id);
});

module.exports = router;
