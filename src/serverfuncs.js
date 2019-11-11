import * as tradeFuncs from './components/tradewindow.js';
import React from 'react';
import {MD5} from './md5';
export const apiURL = "http://fantasycollecting.hamilton.edu/api";

/* eslint-disable require-jsdoc */
export {getArtworkInfo, putArtworkInfo, deleteArtworkInfo,
  logBackInUser, logOutUser, getAllUsers, createUser, getAllArtworks, 
  createArtwork, checkForTrade, updateUserData, deleteUser, 
  
  initiateTrade, acceptTrade, declineTrade, cancelTrade, setTradeUser, setTradeID,
  addGuildersToTrade,
  addArtworkToTrade, removeItemsFromTrade, finalizeAsBuyer, finalizeAsSeller, sendFormToAdmin,


isAdmin};

// if (localStorage.getItem('username') === 'dholley') {
//   logBackInUser();
// }

/*


  coroutine functions


*/

function coroutine(f) {
  const o = f();
  o.next();
  return function(x) {
    o.next(x);
  };
}

/*


  trading functions


*/

var RESPONSE_INTERVAL_REF;
var ITEM_INTERVAL_REF;
var FINALIZE_INTERVAL_REF;
var CURRENT_TRADE_ID;
var CURRENT_TRADE_USER;

const tradeCheck = coroutine(function* () {
  while (true) {
    yield;
    checkForTrade();
  }
});
setInterval(tradeCheck, 5000);

const itemCheck = coroutine(function* () {
  while (true) {
    yield;
    updateItems();
  }
});

const finalizeCheck = coroutine(function* () {
  while (true) {
    yield;
    checkForFinalize();
  }
});

const responseCheck = coroutine(function* () {
  while (true) {
    yield;
    checkForResponse();
  }
});

async function checkForFinalize() {
  const response = await fetch(apiURL + '/trades/' + CURRENT_TRADE_ID);
  const myJson = await response.json();
  const trade = JSON.parse(JSON.stringify(myJson))['0'];
  if (typeof trade === 'undefined') {
    clearInterval(RESPONSE_INTERVAL_REF);
    tradeFuncs.closeTrade();
    return;
  }
  if(trade.sellerapproved === 1 && trade.buyerapproved === 1) {
    clearInterval(FINALIZE_INTERVAL_REF);
    clearInterval(ITEM_INTERVAL_REF);
    tradeFuncs.closeTrade();
    if(trade.buyer == localStorage.getItem('username')) {
      sendFormToAdmin();
      cancelTrade();
    }
  }
}

async function updateItems() {
  console.log(CURRENT_TRADE_ID);
  const items = await fetch(apiURL + '/tradedetails/' + CURRENT_TRADE_ID);
  const items_json = await items.json();
  const final_items = JSON.parse(JSON.stringify(items_json));
  tradeFuncs.populateUserTradeFields(final_items);
}

function addArtworkToTrade(artwork) {
  fetch(apiURL + '/tradedetails', {
    method: 'post',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(
        {tradeid: CURRENT_TRADE_ID,
        buyer: CURRENT_TRADE_USER,
        seller: localStorage.getItem('username'),
        offer: artwork,
        approved: 0})
  }).then(function (res) {
    console.log(res);
  })
}

function removeItemsFromTrade() {
  fetch(apiURL + '/tradedetails/'+CURRENT_TRADE_ID, {
    method: 'delete',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json'
    },
  }).then(function (res) {
    console.log(res);
  })
}

function addGuildersToTrade(guilders, user) {
  fetch(apiURL + '/tradedetails/'+CURRENT_TRADE_ID, {
    method: 'post',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(
        {buyer: localStorage.getItem('username'),
        seller: user,
        offer: guilders,
        approved: false})
  }).then(function (res) {
    FINALIZE_INTERVAL_REF = setInterval(finalizeCheck, 1000);
    console.log(res);
  })
}

/*


  buyer functions


*/

async function initiateTrade(user) {
  if(user == localStorage.getItem('username')) {
    console.log('cannot trade with self');
    return;
  }
  const response = await fetch(apiURL +'/users/'+user);
  const myJson = await response.json();
  const exists = JSON.parse(JSON.stringify(myJson))['0'];
  if(typeof exists === 'undefined') {
    console.log('user does not exist');
    return;
  }
  const tid = Date.now();
  CURRENT_TRADE_ID = tid;
  fetch(apiURL + '/trades', {
    method: 'post',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(
        {tradeid: tid,
        seller: user,
        buyer: localStorage.getItem('username'),
        buyerinit: true,
        sellerinit: false,
        buyerapproved: false,
        sellerapproved: false})
  }).then(function (res) {
    console.log("trade requested sent to "+user);
    RESPONSE_INTERVAL_REF = setInterval(responseCheck, 5000);
  })
}

function setTradeUser(user) {
  CURRENT_TRADE_USER = user;
}

function setTradeID(id) {
  CURRENT_TRADE_ID = id;
}

async function checkForResponse() {
  const response = await fetch(apiURL + '/trades/' + CURRENT_TRADE_ID);
  const myJson = await response.json();
  const trade = JSON.parse(JSON.stringify(myJson))['0'];
  if (typeof trade === 'undefined') {
    console.log("TRADE WAS CANCELLED");
    clearInterval(RESPONSE_INTERVAL_REF);
    return;
  }
  if(trade.sellerinit == true) {
    CURRENT_TRADE_USER = trade.seller;
    tradeFuncs.openTrade();
    clearInterval(RESPONSE_INTERVAL_REF);
    ITEM_INTERVAL_REF = setInterval(itemCheck, 1000);
  }
}

function finalizeAsBuyer(check) {
  console.log("setting approval");
  console.log(check);
  fetch(apiURL + '/trades/'+CURRENT_TRADE_ID, {
    method: 'put',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(
        {buyerapproved: check})
  }).then(function (res) {
    console.log(res);
    if(check) {
      FINALIZE_INTERVAL_REF = setInterval(finalizeCheck, 1000);
    }
    else {
      clearInterval(FINALIZE_INTERVAL_REF);
    }
  })
}

function sendFormToAdmin() {
  fetch(apiURL + '/tradedetails/'+CURRENT_TRADE_ID, {
    method: 'put',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(
        {approved: true})
  }).then(function (res) {
    console.log(res);
  });
  
  clearInterval(ITEM_INTERVAL_REF);
}

/*


  seller functions


*/

async function checkForTrade() {
  // if(typeof localStorage.getItem('username') === 'undefined') return;
  // //console.log('checking for trade');
  // var theTrades = [];
  // //console.log(Date.now());
  // const response = await fetch(apiURL + '/trades/');
  // const myJson = await response.json();
  // //const trades = JSON.parse(JSON.stringify(myJson))['0'];
  // for(var trade of myJson) {
  //   //console.log(trade);
  //   if(trade.seller == localStorage.getItem('username')) {
  //     theTrades.push(trade);
  //   }
  // }
  // if(theTrades.length > 0) {
  //   console.log("MATCHED FOR TRADE")
  //   document.getElementById("mainalert").style.display = 'block';
  //   tradeFuncs.addTrades(theTrades);
  // }
  // else {
  //   console.log('no trade');
  // }
}

async function acceptTrade(tid) {
  console.log(tid);
  fetch(apiURL + '/trades/'+tid, {
    method: 'put',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(
        {sellerinit: true})
  }).then(function (res) {
    CURRENT_TRADE_ID = tid;
    console.log(res);
    // add trade ui
    ITEM_INTERVAL_REF = setInterval(itemCheck, 1000);
  })
}

async function declineTrade(tid) {
  fetch(apiURL + '/trades/'+tid, {
    method: 'delete',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json'
    },
  }).then(function (res) {
    console.log(res);
  })
}

async function cancelTrade() {
  fetch(apiURL + '/trades/'+CURRENT_TRADE_ID, {
    method: 'delete',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json'
    },
  }).then(function (res) {
    console.log(res);
  })
}

function finalizeAsSeller(check) {
  fetch(apiURL + '/trades/'+CURRENT_TRADE_ID, {
    method: 'put',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(
        {sellerapproved: check})
  }).then(function (res) {
    console.log(res);
    if(check) {
      FINALIZE_INTERVAL_REF = setInterval(finalizeCheck, 1000);
    }
    else {
      clearInterval(FINALIZE_INTERVAL_REF);
    }
  })
}

/*


            USER MANAGEMENT FUNCS


*/

async function logBackInUser() {
  //let history = useHistory();
  const stringName = localStorage.getItem('username');
  const response = await fetch(apiURL + '/users/' + stringName);
  const myJson = await response.json();
  const student = JSON.parse(JSON.stringify(myJson))['0'];
  if (typeof student === 'undefined') {
    localStorage.clear();
  } else {
    if(student.admin === 1) {
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

async function isAdmin(user) {
  const response = await fetch(apiURL + '/users');
  const myJson = await response.json();
  const users = JSON.parse(JSON.stringify(myJson));
  for(var u in users) {
    if(users[u].username === user) {
      return u.admin;
    }
  }
}

async function getAllUsers() {
  //console.log("getting all users");
  const response = await fetch(apiURL + '/users');
  const myJson = await response.json();
  const students = JSON.parse(JSON.stringify(myJson));
  // console.log("students: ");
  // console.log(students);
  return students;
}

async function getAllArtworks() {
  const response = await fetch(apiURL + '/artworks');
  const myJson = await response.json();
  const artworks = JSON.parse(JSON.stringify(myJson));
  return artworks;
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

async function createUser(user) {
  //const stringName = localStorage.getItem('username');
  const response = await fetch(apiURL + '/users/' + user.username);
  const myJson = await response.json();
  const student = JSON.parse(JSON.stringify(myJson))['0'];
  if (typeof student === 'undefined') {
    console.log(user);
    fetch(apiURL + '/users/', {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
          {username: user.username,
            hash: MD5('password'),
            name: user.name,
            admin: false,
            guilders: user.money,
            microresearchpoints: user.kudos,
            numofpaintings: user.artworks,
          }),
    }).then(function(res) {
      console.log(res);
    })
  } else {
    console.log('User already exists.');
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

// function testlog() {
//   console.log('binlog test');
// }

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

async function getArtworkInfo(art) {
  const response = await fetch(apiURL + '/artworks/'+art);
  const myJson = await response.json();
  const artwork = JSON.parse(JSON.stringify(myJson))['0'];
  console.log(artwork);
  return artwork;
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


