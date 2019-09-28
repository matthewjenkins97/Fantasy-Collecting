const request = require('request');
const fetch = require('node-fetch');
// request.post({url:'http://localhost:3000/artworks', form:
//     {
//       'title': 'Mona Lisa',
//       'artist': 'Leonardo Da Vinci',
//       'year': 1500,
//       'theoreticalPrice': 50,
//       'actualPrice': 50,
//       'hidden': false,
//       'history': [
//         ['user1', 'user2', 'price', 'timestamp'],
//       ],
//     }}
// );

const body1 = {
  'title': 'Mona Lisa',
  'artist': 'Leonardo Da Vinci',
  'year': 1500,
  'theoreticalPrice': 50,
  'actualPrice': 50,
  'hidden': false,
  'history': [
    ['user1', 'user2', 'price', 'timestamp'],
  ],
};
const body2 = {
  'title': 'Starry Night',
  'artist': 'Leonardo Da Vinci',
  'year': 1500,
  'theoreticalPrice': 50,
  'actualPrice': 50,
  'hidden': false,
  'history': [
    ['user1', 'user2', 'price', 'timestamp'],
  ],
};

const edit1 = {'artist': 'Leo'};

// POST METHOD

// fetch('http://localhost:3000/artworks', {
//   method: 'post',
//   body: JSON.stringify(body1),
//   headers: {'Content-Type': 'application/json'},
// })
//     .then((res) => res.json())
//     .then((json) => console.log(json));



// delete method


fetch('http://localhost:3000/artworks/MonaLisa', {
  method: 'delete',
}).then((response) =>
  response.json().then((json) => {
    return json;
  })
);

request.get('http://localhost:3000/artworks', function(error, response, body) {
  console.log(body);
  // let fun = JSON.parse(body);
  // fun['default']['title'] = "the oogieloves and the big baloon adventure";
  // console.log(fun);
});
