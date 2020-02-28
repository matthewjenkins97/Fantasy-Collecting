import React, { useState } from "react";

import * as auctionfuncs from '../auctionfuncs';
import * as serverfuncs from '../serverfuncs';

import './backgroundlogin.css'
import { ART } from "react-native";

class LotImage extends HTMLImageElement {
  index = 0;
  constructor() {
    super();
  }
}

customElements.define('lot-image', LotImage, {extends: 'img'});

let currentLotId;

let currentLotName;

let currentAuctions = [];

function closeCreateDropdown() {
  document.getElementById("createauctiondropdown").style.top = "-200px";
}
function openCreateDropdown() {
  document.getElementById("createauctiondropdown").style.top = "50px";
}
function closeAddDropdown() {
  document.getElementById("addauctiondropdown").style.display = "none";
}
function openAddDropdown(id) {
  document.getElementById("addauctiondropdown").style.display = "block";
  currentLotId = id;
}

async function createAuction() {
  await auctionfuncs.createAuction(
    document.getElementById("auctionname").value,
    Date.now().toString(),
    document.getElementById("auctiondate").value.toString(),
  );
}
async function addLotToAuction() {
  await auctionfuncs.createLot(currentLotId, document.getElementById("selectedartwork").innerHTML, document.getElementById("addlotessay").value, await serverfuncs.getAllArtworks());
  document.getElementById("selectedartwork").innerHTML = "select artwork";
}
var ARTWORKSLOADED = false;
var INNER = false;
async function loadArtworksForLot() {
  if(INNER) {
    INNER = false;
    return;
  }
  document.getElementById("addlotname").style.height = "100px";
  document.getElementById("addlotname").style.overflowY = "scroll";
  if(ARTWORKSLOADED)return;
  const artworks = await serverfuncs.getAllArtworks();
  for(let a in artworks) {
    let buttonNode = document.createElement("p");
    buttonNode.innerHTML = artworks[a].identifier;
    buttonNode.onclick = function() {
      INNER = true;
      document.getElementById("selectedartwork").innerHTML = this.innerHTML;
      document.getElementById("addlotname").style.height = "20px";
      document.getElementById("addlotname").scrollTop = 0;
      document.getElementById("addlotname").style.overflowY = "hidden";

    }
    document.getElementById("addlotname").appendChild(buttonNode);
  }
  ARTWORKSLOADED = true;
}

class AuctionAdmin extends React.Component{
    constructor(props) {
      super(props);
      document.body.className = "background";
    };

    componentDidMount() {
      this.loadAuctions();
    }

    async loadAuctions() {
      for(let a in currentAuctions) {
        try {
          document.getElementById(currentAuctions[a]).remove();
        }catch{}
      }

      currentAuctions = [];

      let auctions = await auctionfuncs.getAllAuctions();

      try{document.getElementById("bnode").remove()}catch{}
      let buttonNode = document.createElement("button");
      buttonNode.onclick = () => openCreateDropdown();
      buttonNode.className = "createButton";
      buttonNode.innerHTML = "Create Auction...";
      buttonNode.id = "bnode";
      document.getElementById("abutton").appendChild(buttonNode);

      let lots = await auctionfuncs.getAllLots();
      for(let auction in auctions) {
        await this.loadLots(auctions[auction].identifier, auctions[auction].groupid, lots, this);
      }
      this.forceUpdate();
    }

    async loadLots(title, id, lots, c_ref) {
      let titleNode = document.createElement("p");
      titleNode.id = "titlenode"+id;
      titleNode.innerHTML = title;
      document.getElementById("auctions").append(titleNode);
      titleNode.style.color = "white";
      titleNode.style.backgroundColor = "#002f86";
      titleNode.style.width = "auto";
      titleNode.style.borderRadius = "5px";
      titleNode.style.width = "20%";
      titleNode.style.padding = "5px";

      let timerNode = document.createElement("p");
      timerNode.id = "timernode"+id;
      timerNode.innerHTML = "00:00:00";
      document.getElementById("auctions").append(timerNode);
      timerNode.style.color = "white";
      timerNode.style.backgroundColor = "#002f86";
      timerNode.style.width = "auto";
      timerNode.style.borderRadius = "5px";
      timerNode.style.width = "15%";
      timerNode.style.padding = "5px";

      let addLotNode = document.createElement("button");
      addLotNode.id = id;
      addLotNode.innerHTML = "Create Lot"
      addLotNode.onclick = function () {
        openAddDropdown(this.id);
      };
      document.getElementById("auctions").append(addLotNode);

      let deleteNode = document.createElement("button");
      deleteNode.id = "deletNode"+id;
      deleteNode.innerHTML = "Delete Auction"
      deleteNode.onclick = async function () {
        await auctionfuncs.deleteAuction(id);
        c_ref.loadAuctions();
      };
      document.getElementById("auctions").append(deleteNode);

      // let confirmNode = document.createElement("button");
      // confirmNode.id = "confirmNode"+id;
      // confirmNode.innerHTML = "Confirm Auction"
      // confirmNode.onclick = async function () {
      //   const artworks = await serverfuncs.getAllArtworks();

      //   for(let lot in lots) {
      //     if(lots[lot].number.toString() === id.toString()) {
      //       for(let a in artworks) {
      //         if(artworks[a].identifier.toString() === lots[lot].identifier.toString()) {
      //           await auctionfuncs.conductAuctionTrade(lots[lot].identifier, lots[lot].username, artworks[a].owner, lots[lot].highestbid);
      //         }
      //       }
      //     }
      //   }
      //   await auctionfuncs.deleteAuction(id);
      //   c_ref.loadAuctions();
      // };
      //document.getElementById("auctions").append(confirmNode);

      let auctionnode = document.createElement("div");
      auctionnode.className = "auctionscroll";
      auctionnode.id = "auctionscroll"+id.toString();
      document.getElementById("auctions").append(auctionnode);
      document.getElementById("auctions").append(document.createElement("br"));
      currentAuctions.push(auctionnode.id);
      currentAuctions.push(titleNode.id);
      currentAuctions.push(deleteNode.id);
      currentAuctions.push(addLotNode.id);
      //currentAuctions.push(confirmNode.id);
      
      let auctionnumber = -1;
      for(const l in lots) {

        if(lots[l].number != id) continue;
        auctionnumber++;
        const source_of_image = await serverfuncs.getArtworkInfo(lots[l].identifier);
        let auction_scroll = auctionnode;

        let deleteNode = document.createElement("button");
        deleteNode.innerHTML = "Delete Lot";
        deleteNode.style.position = "absolute";
        deleteNode.style.left = (auctionnumber*550).toString()+"px";
        deleteNode.onclick = async function() {
          await auctionfuncs.deleteLot(lots[l].identifier);
          c_ref.loadAuctions();
        }
        auction_scroll.appendChild(deleteNode);

        // EDIT
        let confirmNode = document.createElement("button");
        confirmNode.id = "confirmlot"+l.toString();
        confirmNode.innerHTML = "Confirm Lot";
        confirmNode.style.position = "absolute";
        confirmNode.style.left = (auctionnumber*550+75).toString()+"px";
        confirmNode.onclick = async function () {
          const artworks = await serverfuncs.getAllArtworks();
          let l = parseInt(this.id.slice(10));
          for(let a in artworks) {
            if(artworks[a].identifier.toString() === lots[l].identifier.toString()) {
              await auctionfuncs.conductAuctionTrade(lots[l].identifier, lots[l].username, artworks[a].owner, lots[l].highestbid, lots[l].number);
            }
          }
          c_ref.loadAuctions();
        };
        auction_scroll.appendChild(confirmNode);

        let imagenode = document.createElement("img", {is: 'lot-image'});
        imagenode.id = "auction_pic"+l.toString();
        imagenode.index = auctionnumber;
        imagenode.src = source_of_image.url;
        imagenode.style.left = (10+550*auctionnumber).toString()+'px';
        imagenode.onclick = function() {
          document.getElementById("lotdropdown").style.top = "50px";
          document.getElementById("lotnumber").innerHTML = "LOT "+this.index.toString();
          document.getElementById("lotimage").src = this.src;
          document.getElementById("lotinfo").innerHTML = 
          "<pre>INFO:\n"+
          "\nTITLE:  "+source_of_image.title+
          "\n\nARTIST:  "+source_of_image.artist+
          "\n\nYEAR:  "+source_of_image.year+
          "\n\nOWNER:  "+source_of_image.owner+
          "\n\nCURRENT HIGHEST BID:\n"+lots[l].highestbid+
          "</pre>"

          if(lots[l].username === localStorage.getItem("username")) {
            document.getElementById("lotinfo").innerHTML += "<pre>(you)</pre>";
          }
          document.getElementById("lotessay").innerHTML = lots[l].lotessay;
          currentLotName = lots[l].identifier;
        }
        auction_scroll.appendChild(imagenode);

        if(lots[l].sold) {
          let soldnode = document.createElement('a');
          soldnode.style.display = 'absolute';
          soldnode.style.left = (-20+550*auctionnumber).toString()+'px';
          soldnode.innerHTML = 'SOLD';
          soldnode.style.color = 'red';
          soldnode.style.top = '90px';
          soldnode.style.fontSize = '90px';
          auction_scroll.appendChild(soldnode);
          soldnode.style.overflow = 'hidden';
          soldnode.style.transform = 'rotate(25deg)';
        }

    
        let textnode = document.createElement("a");
        textnode.innerHTML =
        "<pre>"+
        "LOT "+auctionnumber.toString()+
        "\n\nTITLE:  "+source_of_image.title+
        "\n\nARTIST:  "+source_of_image.artist+
        "\n\nYEAR:  "+source_of_image.year+
        "\n\nOWNER:  "+source_of_image.owner+
        "\n\nCURRENT HIGHEST BID:\n"+lots[l].highestbid+
        "</pre>";

        if(lots[l].username === localStorage.getItem("username")) {
          textnode.innerHTML += "<pre>(you)</pre>";
        }
        textnode.style.left = (250+550*auctionnumber).toString()+'px';
        auction_scroll.appendChild(textnode);
      }
    }

    async confirmBid() {
      let lots = await auctionfuncs.getAllLots();
      for(let l in lots) {
        if(lots[l].identifier === currentLotName) {
          if(parseInt(document.getElementById("userbid").value) <= parseInt(lots[l].highestbid)) {
            serverfuncs.showNotification("bid must be higher than previous bid");
            return;
          }
          let users = await serverfuncs.getAllUsers();
          for(let u in users) {
            if(users[u].username === localStorage.getItem("username")) {
              if(parseInt(document.getElementById("userbid").value) > users[u].guilders) {
                serverfuncs.showNotification("you do not have enough guilders to post this bid");
                return;
              }
            }
          }
        }
      }
      await auctionfuncs.postBid(
        localStorage.getItem("username"),
        currentLotName,
        document.getElementById("userbid").value
      );
    }
  
    render(){
      return (
        <div>
          <div id = "lotdropdown" className = "lotdropdown">
            <a onClick = {() => {document.getElementById("lotdropdown").style.top = "-600px"}} style = {{
              position: "absolute", top:"15px", right:"20px", fontSize: "20px", cursor: "pointer"
            }}>x</a>
            <a id = "lotnumber" style={{position: "absolute", top:"20px", left:"40px", fontSize: "30px"}}>LOT X</a>
            <img id = "lotimage" style={{
              position: "absolute", height: "300px", width: "300px",
              objectFit: "contain", top: "70px", left: "40px"
             }}></img>
            <a id = "lotinfo" style={{
              position: "absolute", height: "300px", width: "300px",
              objectFit: "contain", top: "70px", left: "300px", overflowX: "wrap", overflowY: "auto"
            }}>INFO</a>
            <p id = "lotdropdowninfo"></p>
            <a style={{position: "absolute", top:"400px", left:"50px", fontSize: "30px"}}>LOT ESSAY</a>
            <p id = "lotessay" style={{
              position: "absolute", height: "100px", width: "500px",
              objectFit: "contain", top: "450px", left: "40px", overflowX: "wrap",
              overflowY: "auto"
            }}></p>
            <input id = "userbid" type = "number" style = {{
              position: "absolute",top: "300px", left: "380px"
            }}></input>
            <button onClick = {async () => {await this.confirmBid(); await this.loadAuctions();
            document.getElementById("lotdropdown").style.top = "-600px";}} 
                    style = {{position: "absolute",top: "320px", left: "420px"
            }}>Place Bid</button>
          </div>
          <div className = 'title'>
            <a>Auctions</a>
          </div>

          <div id = "createauctiondropdown" className = "createdropdown">
            <a onClick = {closeCreateDropdown} style = {{
              position: "absolute",
              top: "5px",
              left: "10px",
              cursor: "pointer"
            }}>x</a>
            <br></br>
            <br></br>
            <a>create auction</a>
            <br></br>
            <br></br>
            <a>auction name</a>
            <br></br>
            <input id = "auctionname" type = "text"></input>
            <br></br>
            <br></br>
            <a>auction end date</a>
            <br></br>
            <input id = "auctiondate" type = "date"></input>
            <br></br>
            <br></br>
            <button onClick = {async () => {closeCreateDropdown(); await createAuction(); this.loadAuctions();}}>submit</button>
          </div>

          <div id = "addauctiondropdown" style = {{
            display: "none",
            backgroundColor: "rgba(0, 0, 0, .7)",
            position: "fixed",
            borderRadius: "10px",
            top: "30%",
            left: "30%",
            width: "40%",
            height: "40%",
            zIndex: 1,
            color: "white",
            textAlign: "center",
            alignContent: "center"
            }}>
            <br></br>
            <div id = "addlotname" className = "addlotdrop" onClick = {() => {
              loadArtworksForLot();
            }}><p id = "selectedartwork">select artwork</p></div>
            <br></br>
            <a>lot essay</a>
            <br></br>
            <textarea id = "addlotessay" type = "text" style={{height: "20%", width: "80%"}}></textarea>
            <br></br>
            <br></br>
            <button onClick = {async () => {await closeAddDropdown(); await addLotToAuction(); this.loadAuctions();}}>submit</button>
            <br></br>
            <br></br>
            <button onClick = {closeAddDropdown}>cancel</button>
          </div>
          
          <div id = "auctions"/>
          <br></br>
          <div id = "abutton" style = {{textAlign: "center"}}/>
          <br></br>
          <br></br>
        </div>
      );
    }
}

export default AuctionAdmin