function checkOfferType(offer) {
  return /^\d+$/.test(offer);
}

export async function conductTrade(buyer, seller, offer, tradeid) {

  // change current owner of painting to buyer
  if(checkOfferType(offer)) {
    // subtract buyer's payment from their account
    let buyerBody = await fetch(`http://fantasycollecting.hamilton.edu/api/users/${buyer}`, {
      method: 'get',
      mode: 'cors',
    })
    buyerBody = await buyerBody.json();
    buyerBody = buyerBody[0];
    buyerBody.guilders = (parseInt(buyerBody.guilders) + parseInt(offer));

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

    // add seller's payment from their account
    let sellerBody = await fetch(`http://fantasycollecting.hamilton.edu/api/users/${seller}`, {
      method: 'get',
      mode: 'cors',
    })
    sellerBody = await sellerBody.json();
    sellerBody = sellerBody[0];
    sellerBody.guilders = (parseInt(sellerBody.guilders) - parseInt(offer));

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
      'seller': seller,
      'buyer': buyer,
      'price': parseInt(offer),
      'timestamp': new Date,
      'tradeid': tradeid
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

  } else {
    fetch(`http://fantasycollecting.hamilton.edu/api/artworks/${offer}`, {
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
  }

  // post transaction to history
  let historyBody = {
    'identifier': offer,
    'seller': seller,
    'buyer': buyer,
    'timestamp': new Date,
    'tradeid': tradeid
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