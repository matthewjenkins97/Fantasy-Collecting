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
  connection.query('SELECT * FROM microresearch', (err, results, fields) => {
    res.send(results);
  });
});

router.get('/:id', function(req, res, next) {
  // both by artwork and by student
  connection.query(`SELECT * FROM microresearch WHERE username = ${req.params.id}`, (err, results, fields) => {
    res.send(results);
  });
});

router.post('/', json(), function(req, res, next) {
  console.log(req.body);
  res.send('POST /microresearch/');
});

router.put('/:id', json(), function(req, res, next) {
  res.send('PUT /microresearch/' + req.params.id);
});

router.delete('/:id', function(req, res, next) {
  res.send('DELETE /microresearch/' + req.params.id);
});

module.exports = router;
