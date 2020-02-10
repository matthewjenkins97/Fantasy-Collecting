import React, { useState } from "react";

import * as auctionfuncs from '../auctionfuncs';
import * as serverfuncs from '../serverfuncs';

import './backgroundlogin.css'

class LotImage extends HTMLImageElement {
  index = 0;
  constructor() {
    super();
  }
}

customElements.define('lot-image', LotImage, {extends: 'img'});

var currentLotId;

var currentLotName;

var currentAuctions = [];

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
    null
  );
}
async function addLotToAuction() {
  await auctionfuncs.createLot(currentLotId, document.getElementById("addlotname").innerHTML, document.getElementById("addlotessay").value, await serverfuncs.getAllArtworks());
}

async function loadArtworksForLot() {
  const artworks = await serverfuncs.getAllArtworks();
  for(var a in artworks) {
    var buttonNode = document.createElement("p");
    buttonNode.innerHTML = artworks[a].identifier;
    buttonNode.onclick = function() {
      document.getElementById("addlotname").innerHTML = this.innerHTML;
      document.getElementById("addlotname").style.height = "20px";
    }
    document.getElementById("addlotname").appendChild(buttonNode);
  }
  document.getElementById("addlotname").style.height = "100px";
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
      for(var a in currentAuctions) {
        try {
          document.getElementById(currentAuctions[a]).remove();
        }catch{}
      }

      currentAuctions = [];

      var auctions = await auctionfuncs.getAllAuctions();

      try{document.getElementById("bnode").remove()}catch{}
      var buttonNode = document.createElement("button");
      buttonNode.onclick = () => openCreateDropdown();
      buttonNode.className = "createButton";
      buttonNode.innerHTML = "Create Auction...";
      buttonNode.id = "bnode";
      document.getElementById("abutton").appendChild(buttonNode);

      var lots = await auctionfuncs.getAllLots();
      for(var auction in auctions) {
        await this.loadLots(auctions[auction].identifier, auctions[auction].groupid, lots, this);
      }
      this.forceUpdate();
    }

    async loadLots(title, id, lots, c_ref) {
      var titleNode = document.createElement("p");
      titleNode.id = "titlenode"+id;
      titleNode.innerHTML = title;
      document.getElementById("auctions").append(titleNode);
      titleNode.style.color = "white";
      titleNode.style.backgroundColor = "#002f86";
      titleNode.style.width = "auto";
      titleNode.style.borderRadius = "5px";
      titleNode.style.width = "20%";
      titleNode.style.padding = "5px";

      var addLotNode = document.createElement("button");
      addLotNode.id = id;
      addLotNode.innerHTML = "Create Lot"
      addLotNode.onclick = function () {
        openAddDropdown(this.id);
      };
      document.getElementById("auctions").append(addLotNode);

      var deleteNode = document.createElement("button");
      deleteNode.id = "deletNode"+id;
      deleteNode.innerHTML = "Delete Auction"
      deleteNode.onclick = async function () {
        await auctionfuncs.deleteAuction(id);
        c_ref.loadAuctions();
      };
      document.getElementById("auctions").append(deleteNode);

      var confirmNode = document.createElement("button");
      confirmNode.id = "confirmNode"+id;
      confirmNode.innerHTML = "Confirm Auction"
      confirmNode.onclick = async function () {
        const artworks = await serverfuncs.getAllArtworks();
        // console.log("all artworks");
        // console.log(artworks);
        for(var lot in lots) {
          if(lots[lot].number.toString() === id.toString()) {
            for(var a in artworks) {
              if(artworks[a].identifier.toString() === lots[lot].identifier.toString()) {
                await auctionfuncs.conductAuctionTrade(lots[lot].identifier, lots[lot].username, artworks[a].owner, lots[lot].highestbid);
              }
            }
          }
        }
        await auctionfuncs.deleteAuction(id);
        c_ref.loadAuctions();
      };
      document.getElementById("auctions").append(confirmNode);

      var auctionnode = document.createElement("div");
      auctionnode.className = "auctionscroll";
      auctionnode.id = "auctionscroll"+id.toString();
      document.getElementById("auctions").append(auctionnode);
      document.getElementById("auctions").append(document.createElement("br"));
      currentAuctions.push(auctionnode.id);
      currentAuctions.push(titleNode.id);
      currentAuctions.push(deleteNode.id);
      currentAuctions.push(addLotNode.id);
      currentAuctions.push(confirmNode.id);
      
      var auctionnumber = -1;
      for(const l in lots) {

        if(lots[l].number != id) continue;
        auctionnumber++;
        const source_of_image = await serverfuncs.getArtworkInfo(lots[l].identifier);
        var auction_scroll = auctionnode;

        var deleteNode = document.createElement("button");
        deleteNode.innerHTML = "Delete Lot";
        deleteNode.style.position = "absolute";
        deleteNode.style.left = (auctionnumber*550).toString()+"px";
        deleteNode.onclick = async function() {
          // console.log(lots[l].identifier);
          await auctionfuncs.deleteLot(lots[l].identifier);
          c_ref.loadAuctions();
        }
        auction_scroll.appendChild(deleteNode);


        var imagenode = document.createElement("img", {is: 'lot-image'});
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

          //document.getElementById("lotinfo").innerHTML += "</pre>";
          document.getElementById("lotessay").innerHTML = lots[l].lotessay;
          currentLotName = lots[l].identifier;
        }
        auction_scroll.appendChild(imagenode);
    
        var textnode = document.createElement("a");
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
      var lots = await auctionfuncs.getAllLots();
      for(var l in lots) {
        if(lots[l].identifier === currentLotName) {
          if(parseInt(document.getElementById("userbid").value) <= parseInt(lots[l].highestbid)) {
            serverfuncs.showNotification("bid must be higher than previous bid");
            return;
          }
          var users = await serverfuncs.getAllUsers();
          for(var u in users) {
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
            {/* <br></br> */}
            {/* <a>auction end date</a> */}
            {/* <br></br> */}
            {/* <input id = "auctiondate" type = "date"></input> */}
            {/* <br></br> */}
            {/* <br></br> */}
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
            <p id = "addlotname" className = "addlotdrop" onClick = {() => {
              loadArtworksForLot();
            }}>select artwork</p>
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
