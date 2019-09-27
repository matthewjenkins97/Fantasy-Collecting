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

const body = {
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

fetch('http://localhost:3000/artworks', {
  method: 'post',
  body: JSON.stringify(body),
  headers: {'Content-Type': 'application/json'},
})
    .then((res) => res.json())
    .then((json) => console.log(json));


request.get('http://localhost:3000/artworks', function(error, response, body) {
  console.log(body);
  // let fun = JSON.parse(body);
  // fun['default']['title'] = "the oogieloves and the big baloon adventure";
  // console.log(fun);
});
