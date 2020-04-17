
import {showNotification} from "./serverfuncs";
import {updateLots} from "./components/adminauction";
import {supdateLots} from "./components/studentauction";

export {getAllLots, getAllAuctions,
  conductAuctionTrade, createAuction,
  createLot, postBid, deleteLot, deleteAuction, archiveAuction, releaseAuction,
  checkForAuctionUpdates, setTrackedLots, trackedLots}

var trackedLots = []

function setTrackedLots(tl) {
  trackedLots = tl;
}

async function checkForAuctionUpdates() {
  //const allAuctions = await getAllAuctions();
  const allLots = await getAllLots();
  if(trackedLots.length > 0 && trackedLots.length !== allLots.length) {
    if(window.location.toString().endsWith("adminauction")) {
      updateLots();
    } else {supdateLots();}
    return; 
  }
  for(let l in allLots) {
    if(trackedLots[l] && allLots[l]) {
      if(trackedLots[l].highestbid !== allLots[l].highestbid && trackedLots[l].identifier === allLots[l].identifier) {
        showNotification("bid on artwork "+trackedLots[l].identifier+" for "+allLots[l].highestbid);
        if(window.location.toString().endsWith("adminauction")) {
          updateLots();
        } else {supdateLots();}
      }
    }
  }
  trackedLots = allLots;
}


async function postBid(username, id, group, bid) {
  await fetch(`http://fantasycollecting.hamilton.edu/api/auction/`+id+'/'+group, {
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

async function archiveAuction(id) {
  await fetch(`http://fantasycollecting.hamilton.edu/api/groups/`+id, {
    method: 'put',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      archived: true
    }),
  }).then(function (res) {
    showNotification("archived auction "+id);
  });
}

async function releaseAuction(id) {
  await fetch(`http://fantasycollecting.hamilton.edu/api/groups/`+id, {
    method: 'put',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      allowstudents: true
    }),
  }).then(function (res) {
    showNotification("released auction "+id);
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

// async function getLot(id) {
//   let auction = await fetch(`http://fantasycollecting.hamilton.edu/api/auction/`, {
//     method: 'get',
//     mode: 'cors',
//   })
//   auction = await auction.json();
//   return auction;
// }

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


async function conductAuctionTrade(artwork, user, seller, offer, auctionid) {
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
  if(seller !== null && typeof seller !== 'undefined') {
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
  }

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

  fetch(`http://fantasycollecting.hamilton.edu/api/auction/`+artwork+'/'+auctionid, {
    method: 'put',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sold: 1,
    }),
  }).then((res) => {
  });

}