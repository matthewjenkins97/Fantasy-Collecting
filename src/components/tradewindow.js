import React from "react";
import ReactDOM from "react-dom";
//import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import * as serverfuncs from '../serverfuncs';
import './tradewindow.css'
//import './checkmark.css'

export { addTrades, currentTradeIds, openTrade, closeTrade, populateUserTradeFields }

var receivingRequest = false;

// function popup() { 
//   //window.open("/tradeoption","_blank","width=550,height=550,left=150,top=200,toolbar=0,status=0,");
// }

var currentTradeIds = []


/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
  document.getElementById("tradeinit").style.width = "200px";
  document.getElementById("maininit").style.marginLeft = "200px";
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
  document.getElementById("tradeinit").style.width = "0";
  document.getElementById("maininit").style.marginLeft = "0";
}

function openalert() {
  document.getElementById("tradealert").style.width = "200px";
  document.getElementById("mainalert").style.marginLeft = "200px";
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closealert() {
  document.getElementById("tradealert").style.width = "0";
  document.getElementById("mainalert").style.marginLeft = "0";
}

function openTrade() {
  document.getElementById("tradewindow").style.width = "100%";
  //populateUserTradeFields();
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeTrade() {
  document.getElementById("tradewindow").style.width = "0";
  endTrade();
  serverfuncs.cancelTrade();
}

var USERS_READ = false;
async function expandUsers() {
  if(USERS_READ) return;
  var userList = await serverfuncs.getAllUsers();
  for(var user in userList) {
    var buttonnode = document.createElement("a");
    buttonnode.id = "user_t"+user.toString();
    buttonnode.innerHTML = userList[user].username;
    buttonnode.onclick = function() { 
      serverfuncs.initiateTrade(this.innerHTML);
    }
    document.getElementById("tradeusers").appendChild(buttonnode);
  }
  document.getElementById("tradeusers").style.height = "100px";
  USERS_READ = true;
}

var ARTWORKS_READ = false;
async function expandArtworks() {
  if(ARTWORKS_READ) return;
  var artList = await serverfuncs.getAllArtworks();
  for(var art in artList) {
    if(artList[art].owner == localStorage.getItem('username')) {
      var buttonnode = document.createElement("a");
      buttonnode.id = "art_t"+art.toString();
      buttonnode.innerHTML = artList[art].identifier;
      buttonnode.onclick = function() {
        serverfuncs.addArtworkToTrade(this.innerHTML.toString());
      }
      document.getElementById("tradeartworks").appendChild(buttonnode);
    }
  }
  document.getElementById("tradeartworks").style.height = "100px";
  ARTWORKS_READ = true;
}

var totalTradeItems = 0;
var itemImages = [];

async function populateUserTradeFields(items) {
  for(var item in items) {
    itemImages.push(await serverfuncs.getArtworkInfo(items[item].offer));
  }
  for(var i = 0; i < totalTradeItems; i++) {
    try {
      document.getElementById("trade_l_t"+i.toString()).remove();
      document.getElementById("trade_l_i"+i.toString()).remove();
    }
    catch {
    }
  }
  totalTradeItems = 0;
  for(var item in items) {
    var parentid;
    if(items[item].buyer == localStorage.getItem('username')) {
      parentid = "otherartworks";
    }
    else {
      parentid = "localartworks";
    }
    var textnode = document.createElement("a");
    textnode.id = "trade_l_t"+item.toString();
    textnode.innerHTML = items[item].offer;
    textnode.style.position = 'relative';
    document.getElementById(parentid).appendChild(textnode);

    var imagenode = document.createElement("img");
    imagenode.id = "trade_l_i"+item.toString();
    imagenode.style.width = "200px";
    imagenode.style.height= "200px";
    imagenode.style.position = 'relative';
    imagenode.src = require("../static/"+itemImages[item].url);
    document.getElementById(parentid).appendChild(imagenode);
    totalTradeItems++;
  }
}

var totalTrades = 0;
var currentTrades = 0;
function addTrades(theTrades) {
  for(var i = 0; i <= totalTrades; i++) {
    try {
      document.getElementById("trade_n"+i.toString()).remove();
      document.getElementById("trade_ba"+i.toString()).remove();
      document.getElementById("trade_bd"+i.toString()).remove();
      document.getElementById("trade_d"+i.toString()).remove();
    }
    catch {
      console.log("out of range");
    }
  }
  currentTrades = 0;
  totalTrades = 0;
  for(var trade in theTrades) {
    var textnode = document.createElement("h1");
    textnode.id = "trade_n"+trade.toString();
    textnode.innerHTML = theTrades[trade].buyer;
    document.getElementById("tradealert").appendChild(textnode);

    var buttonnode = document.createElement("button");
    buttonnode.id = "trade_ba"+trade.toString();
    buttonnode.innerHTML = 'accept';
    buttonnode.className = 'requestbutton';
    buttonnode.onclick = function() {
      serverfuncs.acceptTrade(theTrades[parseInt(this.id[8])].tradeid);
      closealert();
      openTrade();
      serverfuncs.setTradeUser(document.getElementById("trade_n"+this.id[8]).innerHTML);
      receivingRequest = true;
      removeTrade(this.id[8]);
    }
    document.getElementById("tradealert").appendChild(buttonnode);

    var divnode = document.createElement("div");
    divnode.id = "trade_d"+trade.toString();
    document.getElementById("tradealert").appendChild(divnode);

    var buttonnode2 = document.createElement("button");
    buttonnode2.id = "trade_bd"+trade.toString();
    buttonnode2.innerHTML = 'decline';
    buttonnode2.className = 'requestbutton';
    buttonnode2.onclick = function() {
      serverfuncs.declineTrade(theTrades[trade].tradeid);
      removeTrade(parseInt(this.id[8]));
    }
    document.getElementById("tradealert").appendChild(buttonnode2);
    
    totalTrades = trade;
    currentTrades = trade+1;
  }
  if(currentTrades == 0) {
    document.getElementById("mainalert").style.display = 'none';
    closealert();
  }
}

function removeTrade(index) {
  console.log("removing trade from requests");
  try {
    document.getElementById("trade_n"+index.toString()).remove();
    document.getElementById("trade_ba"+index.toString()).remove();
    document.getElementById("trade_bd"+index.toString()).remove();
    document.getElementById("trade_d"+index.toString()).remove();
    currentTrades--;
    if(currentTrades == 0) {
      document.getElementById("mainalert").style.display = 'none';
      closealert();
    }
  }
  catch {
    console.log('failed to delete request');
  }
}

function endTrade() {
  receivingRequest = false;
}

class TradeWindow extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
    <div>

    {/* initiate trade window */}
    <div id="tradeinit" class="sidebarinit">
      <a class="closebtn" onClick={closeNav}>&times;</a>

      <button class="dropbtn" onClick = {expandUsers}>Users</button>

      <div id = "tradeusers" class="dropdown-content"></div>
    </div>

    <div id="maininit">
      <button class="openbtninit" onClick={openNav}>trade</button>
    </div>

    {/* trade window */}
    <div id="tradewindow" class='tradewin' display='none'>
      <a class="closebtn" onClick={closeTrade}>&times;</a>

      <a id = "localitems" class = "myuser">LOCAL USER</a>



      <div class = "addg">
        <a>AddGuilders</a>
        <input id = "addguilders" type = "number"/>

        <div class="dropbtnArtworks" onClick = {expandArtworks}>Artworks
          <div id = "tradeartworks" class="dropdown-content-art"/>
        </div>
        
      </div>
      


      <div id = "localguilders" class = "localg">
        <a id = "currentlocalg">guilders: 0</a>
      </div>

      <div id = "localartworks" class = "locala"/>


      <a class = "localconfirm">confirm
        <input id = "localtconfirm" type = "checkbox" onClick = {
          () => {
            if(receivingRequest) serverfuncs.finalizeAsSeller(document.getElementById("localtconfirm").checked); 
            else serverfuncs.finalizeAsBuyer(document.getElementById("localtconfirm").checked);
          }
        }/>
      </a>

      <a id = "otheritems" class = "otheruser">OTHER USER</a>
      <div id = "otherguilders" class = "otherg">
      <a id = "currentotherg">guilders: 0</a>
      </div>
      <div id = "otherartworks" class = "othera"></div>

    </div>

    {/* alert window */}
    <div id="tradealert" class="sidebaralert">
      <a class="closebtn" onClick={closealert}>&times;</a>
    </div>

    <div id="mainalert">
        <button class="openbtnalert" onClick={openalert}>!trade request</button>
    </div>

    </div>
    )
  }
}

export default TradeWindow

