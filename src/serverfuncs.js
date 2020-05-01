import * as tradeFuncs from './components/tradewindow.js';
import {MD5} from './md5';
import { conductTrade } from './tradefuncs';
import {checkForMessages} from './components/ChatMessage';
import { getAllAuctions, archiveAuction } from './auctionfuncs.js';
import { checkForAuctionUpdates } from './auctionfuncs.js';
export const apiURL = "http://fantasycollecting.hamilton.edu/api";


/* eslint-disable require-jsdoc */
export {updateArtwork, deleteArtwork, getArtworkInfo,
  logOutUser, getAllUsers, createUser, getAllArtworks,
  createArtwork, checkForTrade, updateUserData, deleteUser,
  initiateTrade, acceptTrade, declineTrade, cancelTrade,
  setTradeUser, setTradeID, addGuildersToTrade, addArtworkToTrade,
  removeItemsFromTrade, finalizeAsBuyer, finalizeAsSeller, sendFormToAdmin,
  isAdmin, getHistory, getMicroresearch, postMicroresearch, getTradeDetails,
  getTrades, approveTrade, denyTrade, getUser, setBlurb,
  removeArtworkFromTrade,
  showNotification, hideNotification, resetGame,
  clearApproval, shuffleArtworks};

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

const timerupdate = coroutine(function* () {
  while(true) {
    yield;
    updatetimers();
  }
});
setInterval(timerupdate, 1000);

async function updatetimers() {
  if (!window.location.toString().endsWith("auction") && !window.location.toString().endsWith("/auction")){
    return;
  }

  const auctions = await getAllAuctions();
  for(let t in auctions) {
    let timeleft = new Date(auctions[t].date) - Date.now();
    try {
      if (timeleft < 0) {
        document.getElementById("timernode"+auctions[t].groupid.toString()).innerHTML = 'Expired';
        document.getElementById("timernode"+auctions[t].groupid.toString()).style.color = 'red';
        if(auctions[t].archived == 0 || auctions[t].archived == null) {
          await archiveAuction(auctions[t].groupid);
          Location.reload();
        }
      }
      else {
        document.getElementById("timernode"+auctions[t].groupid.toString()).innerHTML = 
        "Expires in: "+parseTime(timeleft);
      }
    } catch {
      // pass
    }
  }
}
function parseTime(datetime) {
  const datedays = Math.floor(datetime / (1000*60*60*24));
  datetime -= 1000*60*60*24 * datedays;
  const datehours = Math.floor(datetime / (1000*60*60));
  datetime -= 1000*60*60 * datehours 
  const dateminutes = Math.floor(datetime / (1000*60));
  datetime -= 1000*60 * dateminutes;
  const dateseconds = Math.floor(datetime / 1000);
  return datedays.toString().padStart(2, '0') + ":" +
  datehours.toString().padStart(2, '0') + ":" +
  dateminutes.toString().padStart(2, '0')+ ":" +
  dateseconds.toString().padStart(2, '0');
}


const messageCheck = coroutine(function* () {
  while(true) {
    yield;
    checkForMessages();
  }
});

//setInterval(messageCheck, 5000);

const auctionCheck = coroutine(function* () {
  while(true) {
    console.log("CALLED AC");
    yield;
    if(window.location.toString().endsWith("auction")) {
      checkForAuctionUpdates();
    }
  }
})

setInterval(auctionCheck, 5000);



var NOT_REF;

const notCheck = coroutine(function* () {
  while(true) {
    yield;
    hideNotification();
    clearInterval(NOT_REF);
  }
});


function showNotification(notification) {
  clearInterval(NOT_REF);
  try {
    document.getElementById("notification").style.top = "50px";
    document.getElementById("notification").innerHTML = notification;
    NOT_REF = setInterval(notCheck, 5000);
  }
  catch {

  }
}

function hideNotification() {
  document.getElementById("notification").style.top = "-"+document.getElementById("notification").offsetHeight+"px";
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

setInterval(tradeCheck, 2000);

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

async function clearApproval() {
  await fetch(apiURL + '/trades/' + CURRENT_TRADE_ID, {
    method: 'put',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      buyerapproved: 0,
      sellerapproved: 0,
    })
  });
}

async function checkForFinalize() {
  const response = await fetch(apiURL + '/trades/' + CURRENT_TRADE_ID);
  const myJson = await response.json();
  const trade = JSON.parse(JSON.stringify(myJson))['0'];
  if (typeof trade === 'undefined') {
    clearIntervals();
    tradeFuncs.closeTrade();
    return;
  }
  if(trade.seller.toString() === localStorage.getItem("username").toString() && parseInt(trade.sellerapproved) === 0 ||
     trade.buyer.toString() === localStorage.getItem("username").toString() && parseInt(trade.buyerapproved) === 0) {
    clearInterval(FINALIZE_INTERVAL_REF);
    document.getElementById("confirmbutton").innerHTML = "Confirm Trade";
    document.getElementById("ldsanim2").style.display = "none";
    showNotification("trade updated");
    return;
  }
  if(trade.sellerapproved === 1 && trade.buyerapproved === 1) {
    clearInterval(FINALIZE_INTERVAL_REF);
    clearInterval(ITEM_INTERVAL_REF);
    tradeFuncs.closeTrade();
    showNotification("trade sent to admin");
    if(trade.buyer == localStorage.getItem('username')) {
      sendFormToAdmin();
    }
  }
}

async function updateItems() {
  var still_active = await fetch(apiURL + '/trades/' + CURRENT_TRADE_ID);
  still_active = await still_active.json();
  still_active = JSON.parse(JSON.stringify(still_active))['0'];
  if(typeof still_active === 'undefined') {
    // console.log("TRADE CANELLED");
    clearInterval(ITEM_INTERVAL_REF);
    tradeFuncs.closeTrade();
    clearIntervals();
    return;
  }
  const items = await fetch(apiURL + '/tradedetails/' + CURRENT_TRADE_ID);
  const items_json = await items.json();
  const final_items = JSON.parse(JSON.stringify(items_json));
  tradeFuncs.populateUserTradeFields(final_items);
}

async function addArtworkToTrade(artwork) {
  var arts = await fetch(apiURL + '/tradedetails');
  arts = await arts.json();
  for(var art in arts) {
    if(arts[art].offer === artwork && arts[art].tradeid === CURRENT_TRADE_ID) {
      return;
    }
  }

  await fetch(apiURL + '/tradedetails', {
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
  })
}

async function removeArtworkFromTrade(art) {
  var offers = await fetch(apiURL + '/tradedetails/' + CURRENT_TRADE_ID);
  offers = await offers.json();
  for(var offer in offers) {
    if(offers[offer].offer == art) {
      delete offers[offer];
      break;
    }
  }
  await fetch(apiURL + '/tradedetails/'+CURRENT_TRADE_ID, {
    method: 'delete',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json'
    },
  // }).then(function (res) {
  //   console.log(res);
  })

  for(var offer in offers) {
    await fetch(apiURL + '/tradedetails/', {
      method: 'post',
      mode: 'cors',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(offers[offer])
    // }).then(function (res) {
      // console.log(res);
    })
  }
}

async function userHasEnough(name, guilders) {
  var info = await fetch(apiURL + '/users/'+name);
  info = await info.json();
  info = JSON.parse(JSON.stringify(info))['0'];
  // console.log(info);
  return parseInt(info.guilders) >= parseInt(guilders);
}

async function addGuildersToTrade(guilders) {
  if(!(await userHasEnough(localStorage.getItem("username"), guilders))){
    showNotification("not enough guilders");
    return;
  }
  var offers = await fetch(apiURL + '/tradedetails/' + CURRENT_TRADE_ID);
  var change_g = false;
  offers = await offers.json();
  for(var offer in offers) {
    if(offers[offer].seller === localStorage.getItem("username") && offers[offer].tradeid === CURRENT_TRADE_ID && !isNaN(offers[offer].offer)) {
      offers[offer].offer = guilders;
      change_g = true;
      break;
    }
  }
  await fetch(apiURL + '/tradedetails/'+CURRENT_TRADE_ID, {
    method: 'delete',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json'
    },
  });
  if(!change_g) {
    await fetch(apiURL + '/tradedetails/', {
      method: 'post',
      mode: 'cors',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tradeid: CURRENT_TRADE_ID,
        buyer: CURRENT_TRADE_USER,
        seller: localStorage.getItem("username"),
        offer: guilders,
        approved: 0,
      })
    })
  }
  for(var offer in offers) {
    await fetch(apiURL + '/tradedetails/', {
      method: 'post',
      mode: 'cors',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(offers[offer])
    }).then(function (res) {
      // console.log(res);
    })
  }
  document.getElementById("addguilders").value = "";
}

/*


  buyer functions


*/

async function initiateTrade(user) {
  if(user == localStorage.getItem('username')) {
    // console.log('cannot trade with self');
    return;
  }
  const response = await fetch(apiURL +'/users/'+user);
  const myJson = await response.json();
  const exists = JSON.parse(JSON.stringify(myJson))['0'];
  if(typeof exists === 'undefined') {
    // console.log('user does not exist');
    return;
  }
  const tid = Date.now();
  CURRENT_TRADE_ID = tid;
  // console.log(CURRENT_TRADE_ID);
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
    showNotification("Trade Initiated");
    // console.log("trade requested sent to "+user);
    RESPONSE_INTERVAL_REF = setInterval(responseCheck, 2000);
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
    clearInterval(RESPONSE_INTERVAL_REF);
    document.getElementById("ldsanim").style.display = "none";
    document.getElementById("maininit").innerHTML = "trade";
    return;
  }
  if(trade.sellerinit == true) {
    CURRENT_TRADE_USER = trade.seller;
    tradeFuncs.openTrade(false, CURRENT_TRADE_USER);
    clearInterval(RESPONSE_INTERVAL_REF);
    ITEM_INTERVAL_REF = setInterval(itemCheck, 1000);
  }
}

function finalizeAsBuyer(check) {
  // console.log("setting approval");
  // console.log(check);
  fetch(apiURL + '/trades/'+CURRENT_TRADE_ID, {
    method: 'put',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(
        {buyerapproved: check})
  }).then(function (res) {
    // console.log(res);
    if(check) {
      FINALIZE_INTERVAL_REF = setInterval(finalizeCheck, 1000);
    }
    else {
      clearInterval(FINALIZE_INTERVAL_REF);
    }
  })
}

async function sendFormToAdmin() {
  await fetch(apiURL + '/tradedetails/'+CURRENT_TRADE_ID, {
    method: 'put',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(
        {approved: true})
  }); 
}

async function approveTrade(tid) {
  var offers = await fetch(apiURL + '/tradedetails/' + tid);
  offers = await offers.json();
  offers = JSON.parse(JSON.stringify(offers));
  var artworks = await getAllArtworks();
  var users = await getAllUsers();
  for(var offer in offers) {

    var userguilders = 0;
    var username = "";
    var artworkowner = "";
    for(var u in users) {
      if (users[u].username.toString() === offers[offer].seller.toString()) {
        userguilders = users[u].guilders;
        username = users[u].username;
      }
    }
    for(var a in artworks) {
      if(artworks[a].identifier.toString() === offers[offer].offer.toString()) {
        artworkowner = artworks[a].owner;
      }
    }

    if(/^\d+$/.test(offers[offer].offer)) {
      if(parseInt(userguilders) < parseInt(offers[offer].offer)) {
        showNotification("users no longer have the required items for this trade");
        return;
      }
    }
    else {
      if(username !== artworkowner) {
        showNotification("users no longer have the required items for this trade");
        return;
      }
    }
  }

  // this isn't wanted in the final product - keeping it just in case

  // // setting actual price
  // // if length of offers is 2, and it consists of one string and one number, and the users involved are different
  // // it's safe to assume it's an artwork being traded for money
  // if (offers.length === 2) {
  //   const offerTypes = [/^\d+$/.test(offers[0].offer), /^\d+$/.test(offers[1].offer)]

  //   // checking for XOR
  //   if ((offerTypes[0] == true && offerTypes[1] == false) || 
  //     (offerTypes[0] == false && offerTypes[1] == true)) {

  //     // checking for differing owners
  //     if ((offers[0].buyer !== offers[1].buyer) && (offers[0].seller !== offers[1].seller)) {

  //       // once all that checking is done we can set the actual price of the object.

  //       // if offerTypes[0] is a number we set it as the actual price for the other offer
  //       if (offerTypes[0] == true) {
  //         fetch(`http://fantasycollecting.hamilton.edu/api/artworks/${offers[1].offer}`, {
  //           method: 'put',
  //           mode: 'cors',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify({
  //             actualprice: offers[0].offer,
  //           }),
  //         // }).then((res) => {
  //         //   console.log(res)
  //         });

  //       } else {
  //         fetch(`http://fantasycollecting.hamilton.edu/api/artworks/${offers[0].offer}`, {
  //           method: 'put',
  //           mode: 'cors',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify({
  //             actualprice: offers[1].offer,
  //           }),
  //         // }).then((res) => {
  //         //   console.log(res)
  //         });
  //       }
  //     }
  //   }
  // }

  for(var offer in offers) {
    // console.log(offers);
    await conductTrade(offers[offer].buyer, offers[offer].seller, offers[offer].offer, tid);
  }
  try {
    // mark trade as archived, delete trades stuff
    await fetch(apiURL + '/trades/'+tid, {
      method: 'delete',
      mode: 'cors',
      headers: {
          'Content-Type': 'application/json'
      },
    // }).then(function (res) {
    //   console.log(res);
    });
    
    await fetch(apiURL + '/tradedetails/'+tid, {
      method: 'put',
      mode: 'cors',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        archived: 1
      }),
    // }).then(function (res) {
    //   console.log(res);
    });

    showNotification("trade between "+offers[0].buyer+" and "+offers[0].seller+" approved");
  } catch {
    console.error("no trade details");
  }
}

async function denyTrade(tid) {
    await fetch(apiURL + '/trades/'+tid, {
    method: 'delete',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json'
    },
  }).then(function (res) {
  });
  await fetch(apiURL + '/tradedetails/'+tid, {
    method: 'delete',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json'
    },
  }).then(function (res) {
  });
  //clearIntervals();
}

/*


  seller functions


*/

async function checkForTrade() {
  if(!window.location.toString().endsWith("/gallery") && !window.location.toString().endsWith("/auction")) return;
  var theTrades = [];
  const response = await fetch(apiURL + '/trades/');
  const myJson = await response.json();
  for(var trade of myJson) {
    if(trade.seller == localStorage.getItem('username')
    && !(trade.sellerapproved === 1 && trade.buyerapproved === 1)) {
      theTrades.push(trade);
    }
  }
  if(theTrades.length > 0) {
    document.getElementById("mainalert").style.display = 'block';
    tradeFuncs.addTrades(theTrades);
  }
  else {
    tradeFuncs.addTrades(theTrades);
  }
}

async function acceptTrade(tid) {
  // console.log(tid);
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
    // console.log(res);
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
  // }).then(function (res) {
  //   console.log(res);
  })
}

async function cancelTrade() {
  var trade = await fetch(apiURL + '/trades/'+CURRENT_TRADE_ID);
  trade = await trade.json();
  if(trade.sellerapproved === 1 && trade.buyerapproved === 1) return;
  fetch(apiURL + '/trades/'+CURRENT_TRADE_ID, {
    method: 'delete',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json'
    },
  // }).then(function (res) {
    // console.log(res);
  });
  fetch(apiURL + '/tradedetails/'+CURRENT_TRADE_ID, {
    method: 'delete',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json'
    },
  // }).then(function (res) {
    // console.log(res);
  });
  clearIntervals();
}

// async function adminCancelTrade(id) {
//   await fetch(apiURL + '/trades/'+id, {
//     method: 'delete',
//     mode: 'cors',
//     headers: {
//         'Content-Type': 'application/json'
//     },
//   }).then(function (res) {
//     console.log(res);
//   });

//   await fetch(apiURL + '/tradedetails/'+id, {
//     method: 'put',
//     mode: 'cors',
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(
//       {
//       archived: true,
//     }),
//   }).then(function (res) {
//     // console.log(res);
//   });
//   clearIntervals();
// }

function clearIntervals() {
  clearInterval(FINALIZE_INTERVAL_REF);
  clearInterval(RESPONSE_INTERVAL_REF);
  clearInterval(ITEM_INTERVAL_REF);
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
    // console.log(res);
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
      return (users[u].admin === 1);
      // return users[u].admin;
    }
  }
}

async function getUser(user) {
  //console.log("getting all users");
  const response = await fetch(apiURL + '/users/' + user);
  const myJson = await response.json();
  const student = JSON.parse(JSON.stringify(myJson));
  // console.log("student: ");
  // console.log(student);
  return student;
}

async function getAllUsers() {
  //console.log("getting all users");
  const apiURL = "http://fantasycollecting.hamilton.edu/api";
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
  const response = await fetch(apiURL + '/users/' + data.username);
  const myJson = await response.json();
  const students = JSON.parse(JSON.stringify(myJson));
  if (data.hash === "*****"){
    data.hash = students[0].hash;
  } else {
    data.hash = MD5(data.hash);
  }

  // defaulting number based info
  if (!data.admin) {
    data.admin = 0;
  }
  if (!data.formcompleted) {
    data.formcompleted = 0;
  }
  if (!data.guilders) {
    data.guilders = 0;
  }
  if (!data.microresearchpoints) {
    data.microresearchpoints = 0;
  }

  fetch(apiURL + '/users/'+data.username, {
    method: 'put',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(
        {username: data.username,
        hash: data.hash,
        name: data.name,
        admin: data.admin,
        formcompleted: data.formcompleted,
        guilders: data.guilders,
        microresearchpoints: data.microresearchpoints,
        blurb: data.blurb})
  // }).then(function (res) {
  //   console.log(res);
  })
}

async function createUser(user) {
  //const stringName = localStorage.getItem('username');
  if (user.username === undefined) {
    alert('Please specify a username for your user.')
    return;
  }

  const response = await fetch(apiURL + '/users/' + user.username);
  const myJson = await response.json();
  const student = JSON.parse(JSON.stringify(myJson))['0'];
  if (typeof student === 'undefined') {
    // console.log(user);

    // defaulting number based info 
    if (!user.admin) {
      user.admin = 0;
    }
    if (!user.formcompleted) {
      user.formcompleted = 0;
    }
    if (!user.guilders) {
      user.guilders = 0;
    }
    if (!user.microresearchpoints) {
      user.microresearchpoints = 0;
    }

    fetch(apiURL + '/users/', {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
          {username: user.username,
            hash: MD5(user.hash),
            name: user.name,
            admin: user.admin,
            formcompleted: user.formcompleted,
            guilders: user.guilders,
            microresearchpoints: user.microresearchpoints,
            blurb: user.blurb,
          }),
    // }).then(function(res) {
    //   console.log(res);
    })
  } else {
    alert('User already exists.');
  }
}

function deleteUser(username) {
  fetch(apiURL + '/users/'+username, {
    method: 'delete',
    mode: 'cors',
  // }).then(function(res) {
  //   console.log(res);
  })
}

/*

            ADMIN ARTWORK MANAGEMENT FUNCS

*/

async function createArtwork(artwork) {
  //const stringName = localStorage.getItem('username');
  if (artwork.identifier === undefined) {
    alert('Please specify an artwork identifier.');
    return;
  }
  const response = await fetch(apiURL + '/artworks/' + artwork.identifier);
  const myJson = await response.json();
  const artworkInDB = JSON.parse(JSON.stringify(myJson))['0'];
  if (typeof artworkInDB === 'undefined') {
    // defaulting number based info 
    if (!artwork.theoreticalprice) {
      artwork.theoreticalprice = 0;
    }
    if (!artwork.actualprice) {
      artwork.actualprice = 0;
    }
    if (!artwork.rateable) {
      artwork.rateable = 0;
    }
    if(!artwork.title) {
      artwork.title = "...";
    }
    if(!artwork.artist) {
      artwork.artist = "...";
    }
    if(!artwork.owner) {
      artwork.owner = "";
    }

    fetch(apiURL + '/artworks/', {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
          {identifier: artwork.identifier,
          title: artwork.title,
          artist: artwork.artist,
          year: artwork.year,
          theoreticalprice: artwork.theoreticalprice,
          actualprice: artwork.actualprice,
          owner: artwork.owner,
          url: artwork.url,
          rateable: artwork.rateable}),
    // }).then(function(res) {
    //   console.log(res);
    })
  } else {
    alert('Artwork already exists.');
  }
}

async function updateArtwork(data) {

  // defaulting number based info 
  if (!data.theoreticalprice) {
    data.theoreticalprice = 0;
  }
  if (!data.actualprice) {
    data.actualprice = 0;
  }
  if (!data.rateable) {
    data.rateable = 0;
  }

  fetch(apiURL + '/artworks/'+data.identifier, {
    method: 'put',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(
        {title: data.title,
        artist: data.artist,
        year: data.year,
        theoreticalprice: data.theoreticalprice,
        actualprice: data.actualprice,
        owner: data.owner,
        url: data.url,
        rateable: data.rateable})
  // }).then(function (res) {
  //   console.log(res);
  })
}

function deleteArtwork(artwork) {
  fetch(apiURL + '/artworks/'+artwork, {
    method: 'delete',
    mode: 'cors',
  // }).then(function(res) {
  //   console.log(res);
  })
}

/*

            ARTWORK MANAGEMENT FUNCS

*/

async function getArtworkInfo(art) {
  const response = await fetch(apiURL + '/artworks/' + art);
  const myJson = await response.json();
  const artwork = JSON.parse(JSON.stringify(myJson))['0'];
  return artwork;
}

async function getHistory(artwork) {
  //console.log("getting all users");
  const response = await fetch(apiURL + '/history/' + artwork);
  const myJson = await response.json();
  const history = JSON.parse(JSON.stringify(myJson));
  return history;
}

async function getMicroresearch(artwork) {
  const response = await fetch(apiURL + '/microresearch/' + artwork);
  const myJson = await response.json();
  const microresearch = JSON.parse(JSON.stringify(myJson));
  return microresearch;
}

async function postMicroresearch(data) {
  fetch(apiURL + '/microresearch/', {
    method: 'post',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(
        {identifier: data.identifier,
        username: data.username,
        information: data.information,
        timestamp: data.timestamp})
  // }).then(function (res) {
  //   console.log(res);
  })

  let user = await getUser(data.username);
  user = user[0];
  console.log(user);

  fetch(apiURL + '/users/' + data.username, {
    method: 'put',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(
      {
        'microresearchpoints': user.microresearchpoints + 1
      }
    )
  })

}

async function getTradeDetails() {
  const response = await fetch(apiURL + '/tradedetails/');
  const myJson = await response.json();
  const tradedetails = JSON.parse(JSON.stringify(myJson));
  return tradedetails;
}

async function getTrades() {
  const response = await fetch(apiURL + '/trades/');
  const myJson = await response.json();
  const tradedetails = JSON.parse(JSON.stringify(myJson));
  return tradedetails;
}

async function setBlurb(user, blurb) {
    fetch(apiURL + '/users/' + user, {
    method: 'put',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(
        {blurb: blurb})
  // }).then(function (res) {
  //   console.log(res);
  })
}

async function resetGame() {
  // remove all users except those marked as admins
  let users = await getAllUsers();
  for (let user of users) {
    if (user.admin !== 1) {
      fetch(apiURL + '/users/' + user.username, {
        method: 'delete',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
      // }).then(function (res) {
      //   console.log(res);
      })
    }
  }

  let artworks = await getAllArtworks();
  for (let artwork of artworks) {
    // set owner of artwork to none
    fetch(apiURL + '/artworks/' + artwork.identifier, {
      method: 'put',
      mode: 'cors',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        owner: ""
      })
      // }).then(function (res) {
      //   console.log(res);
    })

    // remove all history
    fetch(apiURL + '/history/' + artwork.identifier, {
      method: 'delete',
      mode: 'cors',
      headers: {
          'Content-Type': 'application/json'
      },
    // }).then(function (res) {
    //   console.log(res);
    })

    // remove all microresearch
    fetch(apiURL + '/microresearch/' + artwork.identifier, {
      method: 'delete',
      mode: 'cors',
      headers: {
          'Content-Type': 'application/json'
      },
    // }).then(function (res) {
    //   console.log(res);
    })

    // remove all ratetable information
    fetch(apiURL + '/ratetable/' + artwork.identifier, {
      method: 'delete',
      mode: 'cors',
      headers: {
          'Content-Type': 'application/json'
      },
    // }).then(function (res) {
    //   console.log(res);
    })

  }

  // remove all archived tradedetails
  let tradedetails = await getTradeDetails();
  for (let trade of tradedetails) {
    if (trade.archived === 1) {
      fetch(apiURL + '/tradedetails/' + trade.tradeid, {
        method: 'delete',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
      // }).then(function (res) {
      //   console.log(res);
      })
    }
  }

  logOutUser();
}

async function shuffleArtworks() {
  // Shuffles artworks to all current users who are not admins. Any artwork not marked as rateable is ignored.

  const artworks = await getAllArtworks();
  const users = await getAllUsers();

  // filter playable users - are they admin? if not, push them into playableUsers
  const playableUsers = [];
  for (const user of users) {
    if (user.admin !== 1) {
      playableUsers.push(user);
    }
  }

  // filter rateable artworks - are they rateable? push them into rateableArtworks
  const rateableArtworks = [];
  for (const artwork of artworks) {
    if (artwork.rateable === 1) {
      rateableArtworks.push(artwork);
    }
  }

  // randomly get users and give them an artwork
  for (const artwork of rateableArtworks) {
    let randomUser = playableUsers[Math.floor(Math.random() * (playableUsers.length))];

    await fetch(apiURL + '/artworks/' + artwork.identifier, {
      method: 'put',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        owner: randomUser.username,
      })
    });
  }
}
