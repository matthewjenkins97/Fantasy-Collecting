async function conductTrade(artwork, buyer, seller, offer) {
  // change current owner of painting to buyer
  fetch(`http://fantasycollecting.hamilton.edu/api/artworks/${artwork}`, {
    method: 'put',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      owner: buyer
    }),
  }).then((res) => {
    console.log(res)
  });

  // subtract buyer's payment from their account, increment number of paintings, decrement guilders
  let buyerBody = await fetch(`http://fantasycollecting.hamilton.edu/api/users/${buyer}`, {
    method: 'get',
    mode: 'cors',
  })
  buyerBody = await buyerBody.json();
  buyerBody = buyerBody[0];
  buyerBody.guilders -= offer;
  buyerBody.numofpaintings += 1;
  fetch(`http://fantasycollecting.hamilton.edu/api/users/${buyer}`, {
    method: 'put',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(buyerBody),
  }).then((res) => {
    console.log(res)
  });

  // add seller's payment from their account, increment guilders, increment 10 microrsesarch points
  let sellerBody = await fetch(`http://fantasycollecting.hamilton.edu/api/users/${seller}`, {
    method: 'get',
    mode: 'cors',
  })
  sellerBody = await sellerBody.json();
  sellerBody = sellerBody[0];
  sellerBody.guilders += offer;
  sellerBody.microresearchpoints += 10;
  sellerBody.numofpaintings -= 1;
  fetch(`http://fantasycollecting.hamilton.edu/api/users/${seller}`, {
    method: 'put',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(sellerBody),
  }).then((res) => {
    console.log(res)
  });

  // post transaction to history
  let historyBody = {
    'identifier': artwork,
    'seller': seller,
    'buyer': buyer,
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