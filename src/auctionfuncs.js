
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
    showNotification("created auction "+id+" with name "+name);
  });
}

async function createLot(id, name, essay, artworks) {
  var currentlots = await getAllLots();
  for(var cl in currentlots) {
    if(currentlots[cl].number.toString() === id.toString() && currentlots[cl].identifier.toString() === name.toString()) {
      showNotification("artwork "+name+" already exists in this auction");
      return;
    }
  }

  var user = "sjarosi";
  for(var a in artworks) {
    if(artworks[a].identifier === name) {
      user = artworks[a].owner;
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
      username: user,
      deadline: null,
      groupid: null,
      lotessay: essay,
    }),
  }).then(() => {
    showNotification("created lot "+id+" with name "+name);
  });
}


async function conductAuctionTrade(artwork, user, seller, offer) {
  // change current owner of painting to user
  fetch(`http://fantasycollecting.hamilton.edu/api/artworks/${artwork}`, {
    method: 'put',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      owner: user,
      actualprice: offer
    }),
  }).then((res) => {
  });

  // subtract user's payment from their account, increment number of paintings
  let userBody = await fetch(`http://fantasycollecting.hamilton.edu/api/users/${user}`, {
    method: 'get',
    mode: 'cors',
  })
  userBody = await userBody.json();
  userBody = userBody[0];
  userBody.guilders -= offer;
  fetch(`http://fantasycollecting.hamilton.edu/api/users/${user}`, {
    method: 'put',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userBody),
  });

  // add to seller guilders
  let sellerBody = await fetch(`http://fantasycollecting.hamilton.edu/api/users/${seller}`, {
    method: 'get',
    mode: 'cors',
  })
  sellerBody = await sellerBody.json();
  sellerBody = sellerBody[0];
  sellerBody.guilders += offer;
  fetch(`http://fantasycollecting.hamilton.edu/api/users/${seller}`, {
    method: 'put',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(sellerBody),
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
  });
}