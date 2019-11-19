import React from "react";
import ReactDOM from "react-dom";
//import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import * as serverfuncs from '../serverfuncs';
import './tradewindow.css'
//import { serialize } from "v8";
//import './checkmark.css'

export { addTrades, currentTradeIds, openTrade, closeTrade, populateUserTradeFields }

var receivingRequest = false;

var currentTradeIds = []

window.onbeforeunload = function (e) {
  e.preventDefault();
  serverfuncs.cancelTrade();
  var message = "leave?",
  e = e || window.event;
  // For IE and Firefox
  if (e) {
    e.returnValue = message;
  }
  // For Safari
  return message;
};

function openNav() {
  document.getElementById("tradeinit").style.left = "0px";
  document.getElementById("maininit").style.left = "210px";

  if(document.getElementById("maininit").innerHTML.toString() == "Cancel") {
    serverfuncs.cancelTrade();
    document.getElementById("ldsanim").style.display = "none";
    document.getElementById("maininit").innerHTML = "Trade";
  }
}

function closeNav() {
  document.getElementById("tradeinit").style.left = "-200px";
  document.getElementById("maininit").style.left = "10px";
}

function openalert() {
  document.getElementById("tradealert").style.left = "0px";
  document.getElementById("mainalert").style.left = "210px";
}

function closealert() {
  document.getElementById("tradealert").style.left = "-200px";
  document.getElementById("mainalert").style.left = "10px";
}

function openTrade(isReceiving, other) {
  document.getElementById("tradewindow").style.left = "0%";
  receivingRequest = isReceiving;
  document.getElementById("otheritems").innerHTML = other;
  document.getElementById("localitems").innerHTML = localStorage.getItem("username");

  // if initiated trade, reset button
  document.getElementById("ldsanim").style.display = "none";
  document.getElementById("maininit").innerHTML = "Trade";
}

function closeTrade() {
  document.getElementById("tradewindow").style.left = "-100%";
  document.getElementById("localtconfirm").checked = false;
}

// shows all available users to trade with

async function expandUsers() {
  var userList = await serverfuncs.getAllUsers();
  for(var user in userList) {
    try {
      document.getElementById("user_t"+user.toString()).remove();
    } catch { }
    var buttonnode = document.createElement("a");
    buttonnode.id = "user_t"+user.toString();
    buttonnode.innerHTML = userList[user].username;
    buttonnode.onclick = function() { 
      serverfuncs.initiateTrade(this.innerHTML);
      closeNav();
      document.getElementById("ldsanim").style.display = "inline-block";
      document.getElementById("maininit").innerHTML = "Cancel";
    }
    document.getElementById("tradeusers").appendChild(buttonnode);
  }
  document.getElementById("tradeusers").style.height = "100px";
}

// funtion that displays artworks user can add to the trade
var ARTWORKS_READ = false;
async function expandArtworks() {
  if(ARTWORKS_READ) {
    document.getElementById("tradeartworks").style.height = "70px";
    return;
  }
  var artList = await serverfuncs.getAllArtworks();
  for(var art in artList) {
    if(artList[art].owner == localStorage.getItem('username')) {
      var buttonnode = document.createElement("a");
      buttonnode.id = "art_t"+art.toString();
      buttonnode.innerHTML = artList[art].identifier;
      buttonnode.onclick = function() {
        serverfuncs.addArtworkToTrade(this.innerHTML.toString());
        document.getElementById("tradeartworks").style.height = "0px";
      }
      document.getElementById("tradeartworks").appendChild(buttonnode);
    }
  }
  document.getElementById("tradeartworks").style.height = "70px";
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
      document.getElementById("trade_l_t"+i.toString()).remove();
      document.getElementById("trade_l_i"+i.toString()).remove();
    }
    catch {
    }
  }

  // reset guilder fields

  document.getElementById("currentlocalg").innerHTML = "Guilders: 0";
  document.getElementById("currentotherg").innerHTML = "Guilders: 0";

  // set trade items

  totalTradeItems = 0;
  for(var item in items) {
    if(/^\d+$/.test(items[item].offer)) {
      if(items[item].buyer == localStorage.getItem('username')) {
        document.getElementById("currentotherg").innerHTML = "Guilders:  "+items[item].offer;
      }
      else {
        document.getElementById("currentlocalg").innerHTML = "Guilders:  "+items[item].offer;
      }
    }
    else {
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
      openTrade(true, document.getElementById("trade_n"+this.id[8]).innerHTML);
      serverfuncs.setTradeUser(document.getElementById("trade_n"+this.id[8]).innerHTML);
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

class TradeWindow extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
    
    <div>
    {/* initiate trade window */}
    <div id = "ldsanim" class="lds-dual-ring"></div>
    <div id="tradeinit" class="sidebarinit">
      <a class="closebtn" onClick={closeNav}>&times;</a>

      <button class="dropbtn">Users</button>

      <div id = "tradeusers" class="dropdown-content"></div>
    </div>

    <button id="maininit" class="openbtninit" onClick={() => {
      openNav();
      expandUsers();}}>Trade</button>

    {/* trade window */}
    <div id="tradewindow" class='tradewin' display='none'>
      <a class="closebtn" onClick={() => {closeTrade(); serverfuncs.cancelTrade();}}>cancel</a>

      <a id = "localitems" class = "myuser">My Items</a>


      <div class = "addg">
        <a>Guilders</a>
        <input id = "addguilders" type = "number"/>
        <button onClick = {() => {serverfuncs.addGuildersToTrade(document.getElementById("addguilders").value);}}>Add</button>
      </div>

      <div class="dropbtnArtworks" onClick = {expandArtworks}>Select Artworks to Trade
          <div id = "tradeartworks" class="dropdown-content-art"/>
      </div>


      <div id = "localguilders" class = "localg">
        <a id = "currentlocalg">Guilders: 0</a>
      </div>

      <div id = "localartworks" class = "locala"/>


      <a class = "localconfirm">Confirm
        <input id = "localtconfirm" type = "checkbox" onClick = {
          () => {
            if(receivingRequest) serverfuncs.finalizeAsSeller(document.getElementById("localtconfirm").checked); 
            else serverfuncs.finalizeAsBuyer(document.getElementById("localtconfirm").checked);
          }
        }/>
      </a>

      <a id = "otheritems" class = "otheruser">Other User</a>
      <div id = "otherguilders" class = "otherg">
      <a id = "currentotherg">Guilders: 0</a>
      </div>
      <div id = "otherartworks" class = "othera"></div>

    </div>

    {/* alert window */}
    <div id="tradealert" class="sidebaralert">
      <a class="closebtn" onClick={closealert}>&times;</a>
    </div>

    <button id = "mainalert" class="openbtnalert" onClick={openalert}>Trade Request</button>

    </div>
    )
  }
}

export default TradeWindow

