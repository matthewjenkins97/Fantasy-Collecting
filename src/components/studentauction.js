import React, { useState } from "react";

import * as auctionfuncs from '../auctionfuncs';
import * as serverfuncs from '../serverfuncs';

import './auctions.css'

var currentLotId;

var currentLotName;

var currentAuctions = [];

function closeCreateDropdown() {
  document.getElementById("createauctiondropdown").style.top = "-200px";
}
function openCreateDropdown() {
  document.getElementById("createauctiondropdown").style.top = "0px";
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
  await auctionfuncs.createLot(currentLotId, document.getElementById("addlotname").value);
}

class AuctionStudent extends React.Component{
    constructor(props) {
      super(props);
      //document.body.className = "auction";
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

      const auctions = await auctionfuncs.getAllAuctions();

      console.log("ALL AUCTIONS: ");
      console.log(auctions);

      const lots = await auctionfuncs.getAllLots();
      for(var auction in auctions) {
        await this.loadLots(auctions[auction].identifier, auctions[auction].groupid, lots, this);
      }
      this.forceUpdate();
    }

    async loadLots(title, id, auctions, c_ref) {
      console.log("LOTS:");
      console.log(auctions);
      var titleNode = document.createElement("pre");
      titleNode.id = "titlenode"+id;
      titleNode.innerHTML = title;
      document.getElementById("auctions").append(titleNode);

      // var addLotNode = document.createElement("button");
      // addLotNode.id = id;
      // addLotNode.innerHTML = "Create Lot"
      // addLotNode.onclick = function () {
      //   openAddDropdown(this.id);
      // };
      // document.getElementById("auctions").append(addLotNode);


      var auctionnode = document.createElement("div");
      auctionnode.className = "auctionscroll";
      auctionnode.id = "auctionscroll"+id.toString();
      document.getElementById("auctions").append(auctionnode);
      currentAuctions.push(auctionnode.id);

      var auctionnumber = -1;
      for(const a in auctions) {

        if(auctions[a].number != id) continue;
        auctionnumber++;
        const source_of_image = await serverfuncs.getArtworkInfo(auctions[a].identifier);
        var auction_scroll = auctionnode;

        var imagenode = document.createElement("img");
        imagenode.id = "auction_pic"+a.toString();
        imagenode.src = require('../static/'+source_of_image.url);
        imagenode.style.left = (10+550*auctionnumber).toString()+'px';
        imagenode.onclick = function() {
          document.getElementById("lotdropdown").style.top = "0px";
          document.getElementById("lotnumber").innerHTML = "LOT "+a.toString();
          document.getElementById("lotimage").src = this.src;
          document.getElementById("lotinfo").innerHTML = "info";
          document.getElementById("lotessay").innerHTML = "";
          currentLotName = auctions[a].identifier;
        }
        auction_scroll.append(imagenode);
    
        var textnode = document.createElement("a");
        textnode.innerHTML =
        "<pre> TITLE:  "+source_of_image.title+
        "\n\nARTIST:  "+source_of_image.artist+
        "\n\nYEAR:  "+source_of_image.year+
        "\n\nOWNER:  "+source_of_image.owner+
        "\n\n\nCURRENT HIGHEST BID:\n"+auctions[a].highestbid+
        "\n\nHIGHEST BIDDER:\n"+auctions[a].username+
        "</pre>";
        textnode.style.left = (250+550*auctionnumber).toString()+'px';
        auction_scroll.append(textnode);
      }
    }

    async confirmBid() {
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
              position: "absolute", top:"15px", right:"20px", fontSize: "20px"
            }}>x</a>
            <a id = "lotnumber" style={{position: "absolute", top:"20px", left:"40px", fontSize: "30px"}}>LOT X</a>
            <img id = "lotimage" style={{
              position: "absolute", height: "300px", width: "300px",
              objectFit: "contain", top: "70px", left: "40px"
             }}></img>
            <a id = "lotinfo" style={{
              position: "absolute", height: "300px", width: "300px",
              objectFit: "contain", top: "70px", left: "300px"
            }}>INFO</a>
            <a style={{position: "absolute", top:"400px", left:"50px", fontSize: "30px"}}>LOT ESSAY</a>
            <p id = "lotessay" style={{
              position: "absolute", height: "100px", width: "500px",
              objectFit: "contain", top: "450px", left: "40px", overflowX: "wrap",
              overflowY: "scroll"
            }}></p>
            <input id = "userbid" type = "number" style = {{
              position: "absolute",top: "300px", left: "390px"
            }}></input>
            <button onClick = {this.confirmBid} style = {{
              position: "absolute",top: "320px", left: "420px"

            }}>Place Bid</button>
          </div>
          <div className = 'title'>
            <a>auctions</a>
          </div>

          {/* <div style = {{textAlign: "center"}}>
            <button onClick = {openCreateDropdown} style = {{
              width: "100px", height: "50px", boxAlign: "center", borderRadius: "30px",
              boxShadow: "none"
            }}>Create Auction</button>
          </div> */}

          <br></br>

          <div id = "createauctiondropdown" className = "createdropdown">
            <a onClick = {closeCreateDropdown} style = {{
              position: "absolute",
              top: "5px",
              left: "10px"
            }}>x</a>
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
            top: "50%",
            left: "40%",
            width: "20%",
            height: "20%",
            zIndex: 1,
            color: "white",
            textAlign: "center",
            }}>
            <a>artwork id</a>
            <br></br>
            <input id = "addlotname" type = "text"></input>
            <br></br>
            <br></br>
            <button onClick = {async () => {await closeAddDropdown(); await addLotToAuction(); this.loadAuctions();}}>submit</button>
            <br></br>
            <br></br>
            <button onClick = {closeAddDropdown}>cancel</button>
          </div>

          {/* <a style = {{color: "white"}}>Browse Lots</a> */}
          {/* <div id = "auctionscroll" class = "auctionscroll">
          </div> */}
          <div id = "auctions"/>
        </div>
      );
    }
}

export default AuctionStudent
