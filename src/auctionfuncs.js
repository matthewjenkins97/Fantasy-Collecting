
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
      identifier: null,
      number: null,
      highestbid: bid,
      username: username,
      deadline: null,
      groupid: null
    }),
  }).then((res) => {
    console.log(res);
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
  });
}

async function getAllLots() {
  let auctions = await fetch(`http://fantasycollecting.hamilton.edu/api/auction/`, {
    method: 'get',
    mode: 'cors',
  })
  auctions = await auctions.json();
  console.log("AUCTIONS");
  console.log(auctions);
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

async function createAuction(id, name, d) {
  await fetch(`http://fantasycollecting.hamilton.edu/api/groups/`, {
    method: 'post',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      groupid: name,
      identifier: id,
      date: d,
    }),
  }).then((res) => {
    console.log(res);
  });
}

async function createLot(id, name) {
  fetch(`http://fantasycollecting.hamilton.edu/api/auction/`, {
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
    }),
  }).then((res) => {
    console.log(res);
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