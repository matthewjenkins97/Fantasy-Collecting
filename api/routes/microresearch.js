const express = require('express');
const router = express.Router();

const {json} = require('body-parser')

router.get('/', function(req, res, next) {
  res.send('GET /microresearch/');
});

router.get('/:id', function(req, res, next) {
  res.send('GET /microresearch/' + req.params.id);
});

router.post('/', json(), function(req, res, next) {
  res.send('POST /microresearch/' + req.params.id);
});

router.put('/:id', json(), function(req, res, next) {
  res.send('PUT /microresearch/' + req.params.id);
});

router.delete('/:id', function(req, res, next) {
  res.send('DELETE /microresearch/' + req.params.id);
});

module.exports = router;