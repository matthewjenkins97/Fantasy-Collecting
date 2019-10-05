const express = require('express');
const router = express.Router();

const {json} = require('body-parser')

router.get('/', function(req, res, next) {
  res.send('GET /artworks/');
});

router.get('/:id', function(req, res, next) {
  res.send('GET /artworks/' + req.params.id);
});

router.post('/', json(), function(req, res, next) {
  res.send('POST /artworks/' + req.params.id);
});

router.put('/:id', json(), function(req, res, next) {
  res.send('PUT /artworks/' + req.params.id);
});

router.delete('/:id', function(req, res, next) {
  res.send('DELETE /artworks/' + req.params.id);
});

module.exports = router;