
import {showNotification} from "./serverfuncs";

export {getAllLots, getAllAuctions,
  conductAuctionTrade, createAuction,
  createLot, postBid, deleteLot, deleteAuction}


async function postBid(username, id, bid) {
  await fetch(`http://fantasycollecting.hamilton.edu/api/auction/`+id, {
    method: 'put',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      deadline: null, // remove soon

      highestbid: bid,
      username: username,
    }),
  }).then((res) => {
    console.log(res);
    showNotification("posted bid of "+bid+" on "+id);
  });
}

async function deleteLot(id) {
  await fetch(`http://fantasycollecting.hamilton.edu/api/auction/`+id, {
    method: 'delete',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json'
    },
  }).then(function (res) {
    console.log(res);
    showNotification("deleted lot "+id);
  });
}

async function deleteAuction(id) {
  await fetch(`http://fantasycollecting.hamilton.edu/api/groups/`+id, {
    method: 'delete',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json'
    },
  }).then(function (res) {
    console.log(res);
    showNotification("deleted auction "+id);
  });
}

async function getAllLots() {
  let auctions = await fetch(`http://fantasycollecting.hamilton.edu/api/auction/`, {
    method: 'get',
    mode: 'cors',
  })
  auctions = await auctions.json();
  return auctions;
}

async function getAllAuctions() {
  let auctions = await fetch(`http://fantasycollecting.hamilton.edu/api/groups/`, {
    method: 'get',
    mode: 'cors',
  })
  auctions = await auctions.json();
  console.log("AUCTIONS");
  console.log(auctions);
  return auctions;
}

async function createAuction(name, id, d) {
  await fetch(`http://fantasycollecting.hamilton.edu/api/groups/`, {
    method: 'post',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      groupid: id,
      identifier: name,
      date: d,
    }),
  }).then((res) => {
    showNotification("created auction "+name+" with name "+id);
  });
}

async function createLot(id, name, essay) {
  var currentlots = await getAllLots();
  console.log("currentlots");
  console.log(currentlots);
  for(var cl in currentlots) {
    if(currentlots[cl].number.toString() === id.toString() && currentlots[cl].identifier.toString() === name.toString()) {
      showNotification("artwork "+name+" already exists in this auction");
      return;
    }
  }

  await fetch(`http://fantasycollecting.hamilton.edu/api/auction/`, {
    method: 'post',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      identifier: name,
      number: id,
      highestbid: 0,
      username: "sjarosi",
      deadline: null,
      groupid: null,
      lotessay: essay,
    }),
  }).then((res) => {
    showNotification("created lot "+id+" with name "+name);
  });
}


async function conductAuctionTrade(artwork, user, offer) {
  // change current owner of painting to user
  fetch(`http://fantasycollecting.hamilton.edu/api/artworks/${artwork}`, {
    method: 'put',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      owner: user
    }),
  }).then((res) => {
    console.log(res)
  });

  // subtract user's payment from their account, increment number of paintings
  let userBody = await fetch(`http://fantasycollecting.hamilton.edu/api/users/${user}`, {
    method: 'get',
    mode: 'cors',
  })
  userBody = await userBody.json();
  userBody = userBody[0];
  userBody.guilders -= offer;
  userBody.numofpaintings += 1;
  fetch(`http://fantasycollecting.hamilton.edu/api/users/${user}`, {
    method: 'put',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userBody),
  }).then((res) => {
    console.log(res)
  });

  // post transaction to history
  let historyBody = {
    'identifier': artwork,
    'seller': 'sjarosi',
    'buyer': user,
    'price': offer,
    'timestamp': new Date,
  };
  fetch(`http://fantasycollecting.hamilton.edu/api/history/`, {
    method: 'post',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(historyBody),
  }).then((res) => {
    console.log(res)
  });
}

//conductAuctionTrade('monalisa', 'dholley', 20);

// auction table
// some function which combines trades and tradedetails and prints it out in a nice way for jarosi...?