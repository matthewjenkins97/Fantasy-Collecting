import React from 'react';
import * as auctionfuncs from '../auctionfuncs';
import * as serverfuncs from '../serverfuncs';
import OtherGallery from './homepageofother';
import TradeWindow from './tradewindow';
import './auctions.css';
import Typography from '@material-ui/core/Typography';

export {supdateLots};

let scurrentLotID;
let currentLotId;

let currentLotName;

let currentAuctions = [];

function closeCreateDropdown() {
  document.getElementById('createauctiondropdown').style.top = '-200px';
}
function openCreateDropdown() {
  document.getElementById('createauctiondropdown').style.top = '50px';
}
function closeAddDropdown() {
  document.getElementById('addauctiondropdown').style.display = 'none';
}
function openAddDropdown(id) {
  document.getElementById('addauctiondropdown').style.display = 'block';
  currentLotId = id;
}

async function createAuction() {
  await auctionfuncs.createAuction(
      document.getElementById('auctionname').value,
      Date.now().toString(),
      null,
  );
}
async function addLotToAuction() {
  await auctionfuncs.createLot(currentLotId, document.getElementById('addlotname').innerHTML, document.getElementById('addlotessay').value, await serverfuncs.getAllArtworks());
}

function supdateLots() {
  for(var tl in auctionfuncs.trackedLots) {
    try {
    let mystring = document.getElementById(auctionfuncs.trackedLots[tl].identifier+auctionfuncs.trackedLots[tl].number).innerHTML.toString().split('\n');
    mystring[11] = auctionfuncs.trackedLots[tl].highestbid;
    document.getElementById(auctionfuncs.trackedLots[tl].identifier+auctionfuncs.trackedLots[tl].number).innerHTML = mystring.join('\n');
    }
    catch{}
  }
}

async function loadArtworksForLot() {
  const artworks = await serverfuncs.getAllArtworks();
  for (const a in artworks) {
    const buttonNode = document.createElement('p');
    buttonNode.innerHTML = artworks[a].identifier;
    buttonNode.onclick = function() {
      document.getElementById('addlotname').innerHTML = this.innerHTML;
      document.getElementById('addlotname').style.height = '20px';
    };
    document.getElementById('addlotname').appendChild(buttonNode);
  }
  document.getElementById('addlotname').style.height = '100px';
}

class AuctionStudent extends React.Component {
  constructor(props) {
    super(props);
    document.body.className = 'gallery';
  };

  componentDidMount() {
    this.loadAuctions();
  }

  async loadAuctions() {
    for (const a in currentAuctions) {
      try {
        document.getElementById(currentAuctions[a]).remove();
      } catch {
        //pass
      }
    }

    currentAuctions = [];

    const auctions = await auctionfuncs.getAllAuctions();

    const lots = await auctionfuncs.getAllLots();
    auctionfuncs.setTrackedLots(lots);

    for (const auction in auctions) {
      if(auctions[auction].archived !== 1 && auctions[auction].allowstudents === 1) {
        await this.loadLots(auctions[auction].identifier, auctions[auction].groupid, lots, this);
      }
    }
    this.forceUpdate();
  }

  async loadLots(title, id, lots, cRef) {
    const titleNode = document.createElement('p');
    titleNode.id = 'titlenode'+id;
    titleNode.innerHTML = title;
    document.getElementById('auctions').append(titleNode);
    titleNode.style.color = 'white';
    titleNode.style.backgroundColor = '#002f86';
    titleNode.style.width = 'auto';
    titleNode.style.borderRadius = '5px';
    titleNode.style.width = '20%';
    titleNode.style.padding = '5px';
    currentAuctions.push(titleNode.id);

    const timerNode = document.createElement('p');
    timerNode.id = 'timernode'+id;
    timerNode.innerHTML = 'Expires in: 00:00:00:00';
    document.getElementById('auctions').append(timerNode);
    timerNode.style.color = 'white';
    timerNode.style.backgroundColor = '#002f86';
    timerNode.style.width = 'auto';
    timerNode.style.borderRadius = '5px';
    timerNode.style.width = '15%';
    timerNode.style.padding = '5px';
    currentAuctions.push(timerNode.id);

    const auctionnode = document.createElement('div');
    auctionnode.className = 'auctionscroll';
    auctionnode.id = 'auctionscroll'+id.toString();
    document.getElementById('auctions').append(auctionnode);
    document.getElementById('auctions').append(document.createElement('br'));
    currentAuctions.push(auctionnode.id);

    let auctionnumber = -1;
    for (const l in lots) {
      if (lots[l].number != id) {
        continue;
      }
      auctionnumber++;
      const sourceOfImage = await serverfuncs.getArtworkInfo(lots[l].identifier);
      const auctionScroll = auctionnode;

      const imagenode = document.createElement('img', {is: 'lot-image'});
      imagenode.id = 'auction_pic'+l.toString();
      imagenode.index = auctionnumber;
      imagenode.src = sourceOfImage.url;
      imagenode.style.left = (10+550*auctionnumber).toString()+'px';
      if (!lots[l].sold) {
        imagenode.style.cursor = 'pointer';
        imagenode.onclick = function() {
          document.getElementById('lotdropdown').style.top = '50px';
          document.getElementById('lotnumber').innerHTML = 'LOT '+this.index.toString();
          document.getElementById('lotimage').src = this.src;
          document.getElementById('lotinfo').innerHTML =
          '<pre>Information\n'+
          '\nTitle:  '+sourceOfImage.title+
          '\n\nArtist:  '+sourceOfImage.artist+
          '\n\nYear:  '+sourceOfImage.year+
          '\n\nOwner:  '+sourceOfImage.owner+
          '\n\nHighest Bid:\n'+lots[l].highestbid+
          '</pre>';

          if (lots[l].username === localStorage.getItem('username')) {
            document.getElementById('lotinfo').innerHTML += '<pre>(you)</pre>';
          }
          document.getElementById('lotessay').innerHTML = lots[l].lotessay;
          currentLotName = lots[l].identifier;
          scurrentLotID = lots[l].number;
        };
      }
      auctionScroll.appendChild(imagenode);

      if (lots[l].sold) {
        const soldNode = document.createElement('a');
        soldNode.style.display = 'absolute';
        soldNode.style.left = (-20+550*auctionnumber).toString()+'px';
        soldNode.innerHTML = 'SOLD';
        soldNode.style.color = 'red';
        soldNode.style.top = '90px';
        soldNode.style.fontSize = '90px';
        auctionScroll.appendChild(soldNode);
        soldNode.style.overflow = 'hidden';
        soldNode.style.transform = 'rotate(25deg)';
      }


      const textnode = document.createElement('a');
      textnode.id = lots[l].identifier+lots[l].number;
      textnode.innerHTML =
      '<pre>'+
      'Lot '+(auctionnumber + 1).toString()+
      '\n\nTitle:  '+sourceOfImage.title+
      '\n\nArtist:  '+sourceOfImage.artist+
      '\n\nYear:  '+sourceOfImage.year+
      '\n\nOwner:  '+sourceOfImage.owner+
      '\n\nHighest Bid:\n'+lots[l].highestbid+
      '</pre>';
      if (lots[l].username === localStorage.getItem('username')) {
        textnode.innerHTML += '<pre>(you)</pre>';
      }
      textnode.style.left = (250+550*auctionnumber).toString()+'px';
      auctionScroll.appendChild(textnode);
    }
  }

  async confirmBid() {
    const lots = await auctionfuncs.getAllLots();
    for (const l in lots) {
      if (lots[l].identifier === currentLotName && lots[l].number === scurrentLotID) {
        if (parseInt(document.getElementById('userbid').value) <= parseInt(lots[l].highestbid)) {
          serverfuncs.showNotification('Bid must be higher than previous bid');
          return;
        } else if (document.getElementById('userbid').value === '') {
        // handling accidental empty bids
          serverfuncs.showNotification('Bid cannot be empty');
          return;
        } else if (parseInt(document.getElementById('userbid').value) <= 0) {
          // handling user bids that are negative or 0
          serverfuncs.showNotification('Bid cannot be 0 or negative');
          return;
        }

        const users = await serverfuncs.getAllUsers();
        for (const u in users) {
          if (users[u].username === localStorage.getItem('username')) {
            if (parseInt(document.getElementById('userbid').value) > users[u].guilders) {
              serverfuncs.showNotification('You do not have enough guilders to post this bid');
              return;
            }
          }
        }
      }
    }
    await auctionfuncs.postBid(
        localStorage.getItem('username'),
        currentLotName,
        scurrentLotID,
        document.getElementById('userbid').value,
    );
  }

  render() {
    return (
      <div>
        <div><OtherGallery/></div>
        <div><TradeWindow/></div>
        <div id = 'lotdropdown' className = 'lotdropdown'>
          <a onClick = {() => {
            document.getElementById('lotdropdown').style.top = '-600px';
          }} style = {{position: 'absolute', top: '15px', right: '20px', fontSize: '20px', cursor: 'pointer'}}>x</a>
          <a id = 'lotnumber' style={{position: 'absolute', top: '20px', left: '40px', fontSize: '30px'}}>Lot X</a>
          <img id = 'lotimage' style={{
            position: 'absolute', height: '300px', width: '300px',
            objectFit: 'contain', top: '70px', left: '40px',
          }}></img>
          <a id = 'lotinfo' style={{
            position: 'absolute', height: '300px', width: '300px',
            objectFit: 'contain', top: '70px', left: '300px', overflowX: 'wrap', overflowY: 'auto',
          }}>Info</a>
          <p id = 'lotdropdowninfo'></p>
          <a style={{position: 'absolute', top: '400px', left: '50px', fontSize: '30px'}}>Lot Essay</a>
          <p id = 'lotessay' style={{
            position: 'absolute', height: '100px', width: '500px',
            objectFit: 'contain', top: '450px', left: '40px', overflowX: 'wrap',
            overflowY: 'auto',
          }}></p>
          <input id = 'userbid' type = 'number' style = {{
            position: 'absolute', top: '300px', left: '380px',
          }}></input>
          <button onClick = {async () => {
            await this.confirmBid();
            await this.loadAuctions();
            document.getElementById('lotdropdown').style.top = '-600px';
          }}
          style = {{position: 'absolute', top: '320px', left: '420px',
          }}>Place Bid</button>
        </div>
        <div className = 'title'>
          <Typography variant='h3'>Auctions</Typography>
        </div>

        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <div id = 'auctions'/>

        {/* <div id = 'abutton' style = {{textAlign: 'center'}}/> */}
        <br></br>
        <br></br>

      </div>
    );
  }
}

export default AuctionStudent;
