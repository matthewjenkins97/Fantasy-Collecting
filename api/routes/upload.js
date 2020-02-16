const express = require('express');
const router = express.Router();

const busboy = require('connect-busboy');
const fs = require('fs');

router.use(busboy());

router.get('/', function(req, res) {
  res.json({photos: fs.readdirSync('/home/fantasycollect/public_html/static/media/')});
});

router.post('/', function(req, res) {
  if (req.busboy) {
    req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      // converting illegal HTML characters into legal characters
      // if data is not sanitized then it could cause problems for mysql downline
      if (filename.includes(/[\ ;\/?:@=&\"<>#%{}|\^~\[\]\(\)`…]/)) {
        filename = filename.replace(/[\ ;\/?:@=&\"<>#%{}|\^~\[\]\(\)`…]/, '_');
      }
      const fstream = fs.createWriteStream('/home/fantasycollect/public_html/static/media/' + filename);
      file.pipe(fstream);
      fstream.on('close', function() {
        res.send(`Upload succeeded! Your file is located at http://fantasycollecting.hamilton.edu/static/media/${filename}.`);
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
