/* eslint-disable require-jsdoc */
export {getArtworkInfo, putArtworkInfo, deleteArtworkInfo,
  logInUser, logBackInUser, logOutUser, createUser, createArtPost, checkForTrade, updateUserData};

// if (localStorage.getItem('username') === 'dholley') {
//   logBackInUser();
// }

function coroutine(f) {
  const o = f();
  o.next();
  return function(x) {
    o.next(x);
  };
}
let tradeRequest = false;
const tradeCheck = coroutine(function* () {
  while (true) {
    yield;
    checkForTrade();
    if (tradeRequest) {
      console.log('trade requested');
    }
  }
});

//setInterval(tradeCheck, 1000);

async function checkForTrade() {
  const response = await fetch('http://localhost:9000/students/dholley');
  const myJson = await response.json();
  const student = JSON.parse(JSON.stringify(myJson))['0'];
  if (typeof student !== 'undefined') {
    tradeRequest = true;
  } else {
    console.log('no trade');
  }
}

/*


            USER MANAGEMENT FUNCS


*/

async function logInUser() {
  const stringName = document.getElementById('username').value;
  const response = await fetch('http://localhost:9000/students/'+stringName);
  const myJson = await response.json();
  const student = JSON.parse(JSON.stringify(myJson))['0'];
  if (typeof student === 'undefined') {
    console.log('username does not exist');
  }
  else if(student.hash !== document.getElementById('password').value) {
    console.log('incorrect password for username');
  } else {
    console.log('login successful');
    localStorage.setItem('username', document.getElementById('username').value);
    if(student.admin) {
      window.location.replace('/table');
    } else {
      window.location.replace('/');
    }
  }
}

async function logBackInUser() {
  const stringName = localStorage.getItem('username');
  const response = await fetch('http://localhost:9000/students/'+stringName);
  const myJson = await response.json();
  const student = JSON.parse(JSON.stringify(myJson))['0'];
  if (typeof student === 'undefined') {
    localStorage.clear();
  } else {
    console.log('login successful');
    window.location.replace('/');
  }
}

function logOutUser() {
  localStorage.clear();
  window.location.reload();
}

/*

            ADMIN STUDENT MANAGEMENT FUNCS

*/


async function updateUserData(username) {
  // fetch('http://localhost:9000/users/'+row.username, {
  //   method: 'put',
  //   mode: 'cors',
  //   headers: {
  //       'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify(row)
  // }).then(function (res) {
  //   console.log(res);
  // })
  const body = JSON.stringify(
    {name: document.getElementById(username+'name').value,
      money: document.getElementById(username+'money').value,
      paintings: document.getElementById(username+'paintings').value,
      value: document.getElementById(username+'value').value,
      kudos: document.getElementById(username+'kudos').value,});
  console.log(body);
}

async function createUser() {
  const stringName = localStorage.getItem('username');
  const response = await fetch('http://localhost:9000/students/'+stringName);
  const myJson = await response.json();
  const student = JSON.parse(JSON.stringify(myJson))['0'];
  if (typeof student === 'undefined') {
    fetch('http://localhost:9000/students/', {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
          {username: document.getElementById('username').value,
            hash: document.getElementById('password').value,
            name: document.getElementById('name').value,
            admin: document.getElementById('admin').checked,
            guilders: parseInt(document.getElementById('guilders').value),
            microresearchpoints: parseInt(
                document.getElementById('micropoints').value),
            paintings: document.getElementById('paintings').value,
          }),
    }).then(function(res) {
      console.log(res);
    })
  } else {
    console.log('user already exists');
  }
}


function deleteUser() {
  fetch('http://localhost:9000/students/dholley', {
    method: 'delete',
    mode: 'cors',
  }).then(function(res) {
    console.log(res);
  })
}

/*

            ADMIN ARTWORK MANAGEMENT FUNCS

*/

function createArtPost() {
  fetch('http://localhost:9000/artworks/', {
    method: 'post',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(
        {title: document.getElementById('title').value,
          artist: document.getElementById('artist').value,
          year: document.getElementById('year').value,
          theoreticalprice: parseInt(
              document.getElementById('theoretical').value),
          actualprice: parseInt(document.getElementById('actual').value),
          hidden: document.getElementById('hidden').checked,
          owner: document.getElementById('owner').value,
          url: document.getElementById('url').value,
        }),
  }).then(function(res) {
    console.log(res);
  })
}

function deleteArtworkInfo() {
  fetch('http://localhost:9000/artworks/monalisa', {
    method: 'delete',
    mode: 'cors',
  }).then(function(res) {
    console.log(res);
  })
}

/*

            ARTWORK MANAGEMENT FUNCS

*/

async function getArtworkInfo() {
  const response = await fetch('http://localhost:9000/artworks/'+DocumentFragment.getElementById('artwork').value);
  const myJson = await response.json();
  console.log(JSON.stringify(myJson));
  const artwork = JSON.parse(JSON.stringify(myJson))['0'];
  if (typeof artwork !== 'undefined') {
    console.log(artwork);
    console.log('title: '+artwork['title']);
    console.log('artist: '+artwork['artist']);
    console.log('year: '+artwork['year']);
    console.log('theoreticalprice: '+artwork['theoreticalprice']);
    console.log('actualprice: '+artwork['actualprice']);
    console.log('hidden: '+artwork['hidden']);
    console.log('owner: '+artwork['owner']);
    console.log('url: '+artwork['url']);
  }
  else {
    console.log('artwork does not exist');
  }
}

function putArtworkInfo() {
    fetch('http://localhost:9000/artworks/monalisa', {
        method: 'put',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            { title : 'Mona Lisa',
                artist: 'leo',
                year: 1500,
                theoreticalprice: 100,
                actualprice: 150,
                hidden: true,
                owner: 'dholley',
                url: "none"   
            })
    }).then(function (res) {
        console.log(res);
    })
}

async function makeTrade() {
  const response = await fetch('http://localhost:9000/students/dholley');
  const myJson = await response.json();
  const student = JSON.parse(JSON.stringify(myJson))['0'];

  student.guilders -= 0; //value entered to give 
  student.guilders += 0; //value entered to recieve

  const artworks = ["monalisa", "starrynight"] ;

  for (const artwork in artworks) {
      fetch('http://localhost:9000/owners/'+artwork, {
        method: 'put',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          name: 'monalisa',
          owner: 'dholley'
        },
      }).then(function(res) {
        console.log(res);
      })
  }
  fetch('http://localhost:9000/artworks/dholley', {
    method: 'put',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: student,
  }).then(function(res) {
    console.log(res);
  })
}


