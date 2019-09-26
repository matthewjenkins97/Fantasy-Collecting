// Matthew R. Jenkins, Donald Holley
// Senior Project
// 25 September 2019
//
// Server used for backend of website.
// Modified from next.js's server configuration found here:
// https://github.com/zeit/next.js/blob/canary/examples/custom-server-express/server.js

const next = require('next');
const express = require('express');
const {json} = require('body-parser');

const port = 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();

const artworks = {
  'default': {
    'title': '',
    'artist': '',
    'year': '',
    'theoreticalPrice': 0, // professor only
    'actualPrice': 0, 
    'hidden': true,
    'history': [
      ['user1', 'user2', 'price', 'timestamp'],
    ],
  },
};

/*
example post entry:

{
	"title": "Mona Lisa",
	"artist": "Leonardo Da Vinci",
	"year": 1500,
	"theoreticalPrice": 50,
	"actualPrice": 50,
	"hidden": false,
	"history": []
}
*/

const students = {
  'default': {
    'username': '',
    'name': '',
    'guilders': 0, // student only
    'artworks': ['key1'],
    'microresearch': {
      'key1': 'val1',
    },
    'microresearchPoints': 0,
  },
};

/*
example post entry:

{
  "username": "mjenkins", 
  "name": "Matthew R. Jenkins", 
  "guilders": 100,
  "artworks": ["MonaLisa"],
  "microresearch": {
    "MonaLisa": "This painting exists."
  },
  "microresearchPoints": 0
}
*/


app.prepare().then(() => {
  const server = express();

  // artworks stuff
  server.get('/artworks', (request, response) => {
    response.status(200).json(artworks);
  });

  server.get('/artworks/:id', (request, response) => {
    if (request.params.id in artworks) {
      response.status(200).json(artworks[request.params.id]);
    } else {
      response.sendStatus(404);
    }
  });

  server.post('/artworks', json(), (request, response) => {
    const uuid = request.body.title.replace(/\s/, '');
    if (uuid in artworks) {
      response.sendStatus(422);
    } else {
      artworks[uuid] = request.body;
      response.sendStatus(201);
    }
  });

  server.put('/artworks/:id', json(), (request, response) => {
    if (request.params.id in artworks) {
      for (const key of Object.keys(request.body)) {
        artworks[request.params.id][key] = request.body[key];
      }
      response.sendStatus(200);
    } else {
      response.sendStatus(404);
    }
  });

  server.delete('/artworks/:id', (request, response) => {
    if (request.params.id in artworks) {
      delete artworks[request.params.id];
      response.sendStatus(200);
    } else {
      response.sendStatus(404);
    }
  });

  // students stuff
  server.get('/students', (request, response) => {
    response.status(200).json(students);
  });

  server.get('/students/:id', (request, response) => {
    if (request.params.id in students) {
      response.status(200).json(students[request.params.id]);
    } else {
      response.sendStatus(404);
    }
  });

  server.post('/students', json(), (request, response) => {
    const uuid = request.body.username;
    if (uuid in students) {
      response.sendStatus(422);
    } else {
      students[uuid] = request.body;
      response.sendStatus(201);
    }
  });

  server.put('/students/:id', json(), (request, response) => {
    if (request.params.id in students) {
      for (const key of Object.keys(request.body)) {
        students[request.params.id][key] = request.body[key];
      }
      response.sendStatus(200);
    } else {
      response.sendStatus(404);
    }
  });

  server.delete('/students/:id', (request, response) => {
    if (request.params.id in students) {
      delete students[request.params.id];
      response.sendStatus(200);
    } else {
      response.sendStatus(404);
    }
  });

  // webpage stuff (non server stuff - basically everything else)
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (error) => {
    if (error) throw error;
    console.log(`> Ready on http://localhost:${port}`);
  });
});

