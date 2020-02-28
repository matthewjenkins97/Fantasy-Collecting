const express = require('express');
const router = express.Router();

const busboy = require('connect-busboy');
const fs = require('fs');

router.use(busboy());

// for conversion of file names
function slugify(str) {
  const map = {
    '-': '-',
    '-': '_',
    'a': 'á|à|ã|â|À|Á|Ã|Â',
    'e': 'é|è|ê|É|È|Ê',
    'i': 'í|ì|î|Í|Ì|Î',
    'o': 'ó|ò|ô|õ|Ó|Ò|Ô|Õ',
    'u': 'ú|ù|û|ü|Ú|Ù|Û|Ü',
    'c': 'ç|Ç',
    'n': 'ñ|Ñ',
  };
  str = str.toLowerCase();
  for (const pattern in map) {
    str = str.replace(new RegExp(map[pattern], 'g'), pattern);
  };
  return str;
};

router.get('/', function(req, res) {
  res.json({photos: fs.readdirSync('/home/fantasycollect/public_html/static/media/')});
});

router.post('/', function(req, res) {
  if (req.busboy) {
    req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      // converting illegal HTML characters into legal characters
      // if data is not sanitized then it could cause problems for mysql downline
      filename = slugify(filename);
      if (/[\ ;\/?:@=&\"<>#%{}|\^~\[\]\(\)`]/.test(filename)) {
        filename = filename.replace(/[\ ;\/?:@=&\"<>#%{}|\^~\[\]\(\)`]/g, '_');
      }
      const fstream = fs.createWriteStream('/home/fantasycollect/public_html/static/media/' + filename);

      // for debug purposes.
      // const fstream = fs.createWriteStream('/Users/matthewjenkins97/Developer/SeniorProject/api/uploads/' + filename);

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
