const express = require('express');
const router = express.Router();

const {json} = require('body-parser')

router.get('/', function(req, res, next) {
  res.send('GET /history/');
});

router.get('/:id', function(req, res, next) {
  res.send('GET /history/' + req.params.id);
});

router.post('/', json(), function(req, res, next) {
  res.send('POST /history/' + req.params.id);
});

router.put('/:id', json(), function(req, res, next) {
  res.send('PUT /history/' + req.params.id);
});

router.delete('/:id', function(req, res, next) {
  res.send('DELETE /history/' + req.params.id);
});

module.exports = router;