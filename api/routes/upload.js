const express = require('express');
const router = express.Router();

const busboy = require("connect-busboy")
const fs = require('fs')

router.use(busboy());

router.post('/', function(req, res) {
  if (req.busboy) {
    req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      let fstream = fs.createWriteStream('/home/fantasycollect/public_html/static/media/' + filename); 
      file.pipe(fstream);
      fstream.on('close', function () {
        res.send(`Upload succeeded! Your filename is ${filename}.`);
      });
    });
  }

  return req.pipe(req.busboy); 
});

module.exports = router;

// personal notes
// content-type is application/x-www-form-urlencoded
// body is form-data
// key value is file: (picture)