const express = require('express');
const router = express.Router();

const {json} = require('body-parser')

router.get('/', function(req, res, next) {
  res.send('GET /students/');
});

router.get('/:id', function(req, res, next) {
  res.send('GET /students/' + req.params.id);
});

router.post('/', json(), function(req, res, next) {
  res.send('POST /students/' + req.params.id);
});

router.put('/:id', json(), function(req, res, next) {
  res.send('PUT /students/' + req.params.id);
});

router.delete('/:id', function(req, res, next) {
  res.send('DELETE /students/' + req.params.id);
});

module.exports = router;