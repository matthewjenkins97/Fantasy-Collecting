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

conductAuctionTrade('monalisa', 'dholley', 20);

// auction table
// some function which combines trades and tradedetails and prints it out in a nice way for jarosi...?