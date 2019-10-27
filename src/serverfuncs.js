const apiURL = "http://fantasycollecting.hamilton.edu/api";//"http://localhost:49152";


/* eslint-disable require-jsdoc */
export {getArtworkInfo, putArtworkInfo, deleteArtworkInfo,
  logInUser, logBackInUser, logOutUser, getAllUsers, createUser, 
  createArtwork, checkForTrade, updateUserData};

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
  const response = await fetch(apiURL + '/users/dholley');
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
  //let history = useHistory();
  const stringName = document.getElementById('liusername').value;
  const response = await fetch(apiURL + '/users/'+stringName);
  const myJson = await response.json();
  const student = JSON.parse(JSON.stringify(myJson))['0'];
  if (typeof student === 'undefined') {
    console.log('username does not exist');
  }
  else if(student.hash !== document.getElementById('lipassword').value) {
    console.log('incorrect password for username');
  } else {
    console.log('login successful');
    localStorage.setItem('username', document.getElementById('liusername').value);
    if(student.admin===1) {
      //history.push("/table");
    } else {
      //history.push('/');
    }
  }
}

async function logBackInUser() {
  //let history = useHistory();
  const stringName = localStorage.getItem('username');
  const response = await fetch(apiURL + '/users/'+stringName);
  const myJson = await response.json();
  const student = JSON.parse(JSON.stringify(myJson))['0'];
  if (typeof student === 'undefined') {
    localStorage.clear();
  } else {
    if(student.admin===1) {
      //history.push("/table");
    } else {
      //history.push('/');
    }
  }
}

function logOutUser() {
  localStorage.clear();
  window.location.reload();
}

/*

            ADMIN STUDENT MANAGEMENT FUNCS

*/

async function getAllUsers() {
  console.log("getting all users");
  const response = await fetch(apiURL + '/users');
  const myJson = await response.json();
  const students = JSON.parse(JSON.stringify(myJson))['0'];
  console.log("students: ");
  console.log(students);
  return students;
}

async function getAllArtworksOfUser(user) {
  // const response = await fetch(apiURL + '/artworks');
  // const myJson = await response.json();
  // const artworks = JSON.parse(JSON.stringify(myJson))['0'];
  // var userartworks = [];
  // for(var a in artworks) {
  //   if(a.owner === user) {
  //     userartworks.append(a.identifier);
  //   }
  // }
  // return userartworks;
}

async function updateUserData(data) {
  fetch(apiURL + '/users/'+data.username, {
    method: 'put',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(
        {username: data.username,
        name: data.name,
        guilders: data.money,
        microresearchpoints: data.kudos,
        numofpaintings: data.artworks,})
  }).then(function (res) {
    console.log(res);
  })
}

async function createUser() {
  const stringName = localStorage.getItem('username');
  const response = await fetch(apiURL + '/users/'+stringName);
  const myJson = await response.json();
  const student = JSON.parse(JSON.stringify(myJson))['0'];
  if (typeof student === 'undefined') {
    fetch(apiURL + '/users/', {
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


function deleteUser(username) {
  fetch(apiURL + '/users/'+username, {
    method: 'delete',
    mode: 'cors',
  }).then(function(res) {
    console.log(res);
  })
}

/*

            ADMIN ARTWORK MANAGEMENT FUNCS

*/

function createArtwork(artwork) {
  fetch(apiURL + '/artworks/', {
    method: 'post',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(
        {title: document.getElementById(artwork+'title').value,
          artist: document.getElementById(artwork+'artist').value,
          year: document.getElementById(artwork+'year').value,
          theoreticalprice: parseInt(
              document.getElementById(artwork+'theoretical').value),
          actualprice: parseInt(document.getElementById(artwork+'actual').value),
          hidden: document.getElementById(artwork+'hidden').checked,
          owner: document.getElementById(artwork+'owner').value,
          url: document.getElementById(artwork+'url').value,
        }),
  }).then(function(res) {
    console.log(res);
  })
}

function deleteArtworkInfo() {
  fetch(apiURL + '/artworks/monalisa', {
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
  const response = await fetch(apiURL + '/artworks/'+DocumentFragment.getElementById('artwork').value);
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
    fetch(apiURL + '/artworks/monalisa', {
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
  const response = await fetch(apiURL + '/users/dholley');
  const myJson = await response.json();
  const student = JSON.parse(JSON.stringify(myJson))['0'];

  student.guilders -= 0; //value entered to give 
  student.guilders += 0; //value entered to recieve

  const artworks = ["monalisa", "starrynight"] ;

  for (const artwork in artworks) {
      fetch(apiURL + '/owners/'+artwork, {
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
  fetch(apiURL + '/artworks/dholley', {
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


