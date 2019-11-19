const express = require('express');
const router = express.Router();

const busboy = require("connect-busboy")
const fs = require('fs')

router.use(busboy());

router.post('/', function(req, res) {
  if (req.busboy) {
    req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      let fstream = fs.createWriteStream('../src/static/artworks/' + filename); 
      file.pipe(fstream);
      fstream.on('close', function () {
        res.send(`Upload succeeded! Your filename is ../src/static/artworks/${filename}.`);
      });
    });
  }

  return req.pipe(req.busboy); 
});

module.exports = router;