import React from 'react';
import * as serverfuncs from '../serverfuncs';
import './tradewindow.css'

export { addTrades, currentTradeIds, openTrade, closeTrade, populateUserTradeFields }

class IndexElem extends HTMLElement {
  indexValue = 0;
  constructor() {  
    super();
  }
}
customElements.define('index-element', IndexElem);

var receivingRequest = false;
var currentTradeIds = []

window.onbeforeunload = function (event) {
  event.preventDefault();
  serverfuncs.cancelTrade();
  var message = 'leave?',
  event = event || window.event;
  // For IE and Firefox
  if (event) {
    event.returnValue = message;
  }
  // For Safari
  return message;
};

function openNav() {
  document.getElementById('tradeinit').style.left = '0px';
  document.getElementById('maininit').style.left = '210px';

  if(document.getElementById('maininit').innerHTML.toString() == 'Cancel') {
    serverfuncs.cancelTrade();
    document.getElementById('ldsanim').style.display = 'none';
    document.getElementById('maininit').innerHTML = 'Trade';
  }
}

function closeNav() {
  document.getElementById('tradeinit').style.left = '-200px';
  document.getElementById('maininit').style.left = '10px';
}

function openalert() {
  document.getElementById('tradealert').style.left = '0px';
  document.getElementById('mainalert').style.left = '210px';
}

function closealert() {
  document.getElementById('tradealert').style.left = '-200px';
  document.getElementById('mainalert').style.left = '10px';
}

function openTrade(isReceiving, other) {
  document.getElementById('tradewindow').style.left = '0%';
  receivingRequest = isReceiving;
  document.getElementById('otheritems').innerHTML = other;
  document.getElementById('localitems').innerHTML = localStorage.getItem('username');

  // if initiated trade, reset button
  document.getElementById('ldsanim').style.display = 'none';
  document.getElementById('maininit').innerHTML = 'Trade';
}

function closeTrade() {
  document.getElementById('tradewindow').style.left = '-100%';
  document.getElementById('confirmbutton').innerHTML = 'Confirm Trade';
  document.getElementById('ldsanim2').style.display = 'none';
}

// shows all available users to trade with

async function expandUsers() {
  var userList = await serverfuncs.getAllUsers();
  for(var user in userList) {
    if(userList[user].username === localStorage.getItem('username')
    || userList[user].admin === 1) {
      continue;
    }
    try {
      document.getElementById('user_t'+user.toString()).remove();
    } catch { }
    var buttonnode = document.createElement('a');
    buttonnode.id = 'user_t'+user.toString();
    buttonnode.style.padding = '0px 0px 5px 0px';
    buttonnode.innerHTML = userList[user].username;
    buttonnode.onclick = function() { 
      serverfuncs.initiateTrade(this.innerHTML);
      closeNav();
      document.getElementById('ldsanim').style.display = 'inline-block';
      document.getElementById('maininit').innerHTML = 'Cancel';
    }
    document.getElementById('tradeusers').appendChild(buttonnode);
  }
  document.getElementById('tradeusers').style.height = '100px';
}

// funtion that displays artworks user can add to the trade
var ARTWORKS_READ = false;
async function expandArtworks() {
  if(ARTWORKS_READ) {
    document.getElementById('tradeartworks').style.height = '70px';
    return;
  }
  var artList = await serverfuncs.getAllArtworks();
  for(var art in artList) {
    if(artList[art].owner == localStorage.getItem('username')) {
      var buttonnode = document.createElement('a');
      buttonnode.id = 'art_t'+art.toString();
      buttonnode.innerHTML = artList[art].identifier;
      buttonnode.onclick = async function() {
        await serverfuncs.addArtworkToTrade(this.innerHTML.toString());
        await serverfuncs.clearApproval();
      }
      document.getElementById('tradeartworks').appendChild(buttonnode);
    }
  }
  document.getElementById('tradeartworks').style.height = '70px';
  ARTWORKS_READ = true;
}

var totalTradeItems = 0;
var itemImages = [];

// function for adding current trade items to trade fields



async function populateUserTradeFields(items) {
  itemImages = [];
  for(var item in items) {
    itemImages.push(await serverfuncs.getArtworkInfo(items[item].offer));
  }
  for(var i = 0; i < totalTradeItems; i++) {
    try {
      document.getElementById('trade_l_t'+i.toString()).remove();
      document.getElementById('trade_l_i'+i.toString()).remove();
    }
    catch {
    }
  }
  // reset guilder fields
  document.getElementById('currentlocalg').innerHTML = 'Guilders: 0';
  document.getElementById('currentotherg').innerHTML = 'Guilders: 0';
  // set trade items
  totalTradeItems = 0;
  for(var item in items) {
    if(/^\d+$/.test(items[item].offer)) {
      if(items[item].buyer == localStorage.getItem('username')) {
        document.getElementById('currentotherg').innerHTML = 'Guilders:  '+items[item].offer;
      }
      else {
        document.getElementById('currentlocalg').innerHTML = 'Guilders:  '+items[item].offer;
      }
    }
    else {
      var parentid;
      if(items[item].buyer == localStorage.getItem('username')) {
        parentid = 'otherartworks';
      }
      else {
        parentid = 'localartworks';
      }
      var textnode = document.createElement('a');
      textnode.id = 'trade_l_t'+item.toString();
      textnode.innerHTML = items[item].offer;
      textnode.style.position = 'relative';
      document.getElementById(parentid).appendChild(textnode);

      var imagenode = document.createElement('img');
      imagenode.id = 'trade_l_i'+item.toString();
      imagenode.style.width = '200px';
      imagenode.style.height= '200px';
      imagenode.style.position = 'relative';
      imagenode.src = itemImages[item].url;
      document.getElementById(parentid).appendChild(imagenode);

      if(parentid === 'localartworks') {
        var deletenode = document.createElement('index-element');
        deletenode.className = 'closebtnart';
        deletenode.indexValue = item;
        deletenode.onclick = async function() {
          serverfuncs.removeArtworkFromTrade(items[this.indexValue].offer);
          await serverfuncs.clearApproval();
        }
        deletenode.innerHTML = 'x';
        textnode.appendChild(deletenode);
      }

    }
    totalTradeItems++;
  }
}

var totalTrades = 0;
var currentTrades = 0;
// function for adding incoming trade requests to sidebar

function addTrades(theTrades) {
  for(var i = 0; i <= totalTrades; i++) {
    try {
      document.getElementById('trade_n'+i.toString()).remove();
      document.getElementById('trade_ba'+i.toString()).remove();
      document.getElementById('trade_bd'+i.toString()).remove();
      document.getElementById('trade_d'+i.toString()).remove();
    }
    catch {
    }
  }
  currentTrades = 0;
  totalTrades = 0;
  for(var trade in theTrades) {
    var textnode = document.createElement('h1');
    textnode.id = 'trade_n'+trade.toString();
    textnode.className = 'tradealertdrop';
    textnode.innerHTML = theTrades[trade].buyer;
    document.getElementById('tradealert').appendChild(textnode);

    var buttonnode = document.createElement('button');
    buttonnode.id = 'trade_ba'+trade.toString();
    buttonnode.innerHTML = 'accept';
    buttonnode.className = 'requestbutton';
    buttonnode.onclick = function() {
      serverfuncs.acceptTrade(theTrades[parseInt(this.id[8])].tradeid);
      closealert();
      openTrade(true, document.getElementById('trade_n'+this.id[8]).innerHTML);
      serverfuncs.setTradeUser(document.getElementById('trade_n'+this.id[8]).innerHTML);
      removeTrade(this.id[8]);
    }
    //document.getElementById(textnode.id).appendChild(buttonnode);
    document.getElementById('tradealert').appendChild(buttonnode);


    var divnode = document.createElement('div');
    divnode.id = 'trade_d'+trade.toString();
    document.getElementById('tradealert').appendChild(divnode);

    var buttonnode2 = document.createElement('button');
    buttonnode2.id = 'trade_bd'+trade.toString();
    buttonnode2.innerHTML = 'decline';
    buttonnode2.className = 'requestbutton';
    buttonnode2.onclick = function() {
      serverfuncs.declineTrade(theTrades[trade].tradeid);
      removeTrade(parseInt(this.id[8]));
    }
    //document.getElementById(textnode.id).appendChild(buttonnode2);
    document.getElementById('tradealert').appendChild(buttonnode2);

    
    totalTrades = trade;
    currentTrades = trade+1;
  }
  if(currentTrades == 0) {
    document.getElementById('mainalert').style.display = 'none';
    closealert();
  }
}

function removeTrade(index) {
  try {
    document.getElementById('trade_n'+index.toString()).remove();
    document.getElementById('trade_ba'+index.toString()).remove();
    document.getElementById('trade_bd'+index.toString()).remove();
    document.getElementById('trade_d'+index.toString()).remove();
    currentTrades--;
    if(currentTrades == 0) {
      document.getElementById('mainalert').style.display = 'none';
      closealert();
    }
  }
  catch {
  }
}

var waiting = false;

function confirmanimation() {
  if(waiting) {
    document.getElementById('confirmbutton').innerHTML = 'Confirm Trade';
    document.getElementById('ldsanim2').style.display = 'none';
  }
  else {
    document.getElementById('confirmbutton').innerHTML = 'Cancel Confirm';
    document.getElementById('ldsanim2').style.display = 'inline-block';
  }
  waiting = !waiting;
}

class TradeWindow extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
    
    <div>
    {/* initiate trade window */}
    <div id = 'ldsanim' class='lds-dual-ring'></div>
    <div id='tradeinit' class='sidebarinit'>
      <a class='closebtn' onClick={closeNav}>&times;</a>

      <button class='dropbtn'>Users</button>

      <div id = 'tradeusers' class='dropdown-content'></div>
    </div>

    <button id='maininit' class='openbtninit' onClick={() => {
      openNav();
      expandUsers();}}>Trade</button>

    {/* trade window */}
    <div id='tradewindow' class='tradewin' display='none'>
      <div class = 'centering'>

      <a id = 'localitems' class = 'myuser'>My Items</a>


      <div class = 'addg'>
        <a>Guilders</a>
        <input id = 'addguilders' type = 'number'/>
        <button onClick = {async () => {
          await serverfuncs.addGuildersToTrade(document.getElementById('addguilders').value);
          await serverfuncs.clearApproval();
      }}>Add</button>
      </div>

      <div class='dropbtnArtworks' onClick = {expandArtworks}>Select Artworks to Trade...
          <div id = 'tradeartworks' class='dropdown-content-art'/>
      </div>


      <div id = 'localguilders' class = 'localg'>
        <a id = 'currentlocalg'>Guilders: 0</a>
      </div>

      <div id = 'localartworks' class = 'locala'/>


      <a id = 'confirmbutton' class = 'localconfirm' onClick = {
          () => {
            if(receivingRequest) serverfuncs.finalizeAsSeller(!waiting); 
            else serverfuncs.finalizeAsBuyer(!waiting);
            confirmanimation();
          }
        }>Confirm Trade
      </a>
      <div id = 'ldsanim2' class='lds-dual-ring2'></div>

      <a class='closebtn' onClick={() => {closeTrade(); serverfuncs.cancelTrade();}}>Cancel</a>

      <a id = 'otheritems' class = 'otheruser'>Other User</a>
      <div id = 'otherguilders' class = 'otherg'>
      <a id = 'currentotherg'>Guilders: 0</a>
      </div>
      <div id = 'otherartworks' class = 'othera'></div>
      </div>
    </div>

    {/* alert window */}
    <div id='tradealert' class='sidebaralert'>
      <a class='closebtn' onClick={closealert}>&times;</a>
    </div>

    <button id = 'mainalert' class='openbtnalert' onClick={openalert}>Trade Request</button>

    </div>
    )
  }
}

export default TradeWindow

