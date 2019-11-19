import React, { useState } from "react";
import { View } from "react-native";
//import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper'; 
import * as auctionfuncs from '../auctionfuncs';
import * as serverfuncs from '../serverfuncs';

import Carousel from 'react-bootstrap/Carousel'
import tileData from './tiledata';

import './auctions.css'
import { createRequire } from "module";

class AuctionAdmin extends React.Component{
    constructor(props) {
      super(props);
      this.loadAuctions();
    };

    async loadAuctions() {
      const auctions = await auctionfuncs.getAllAuctions();
      const auction_scroll = document.getElementById("auctionscroll");
      for(const a in auctions) {
        try {
        } catch { }

        const source_of_image = await serverfuncs.getArtworkInfo(auctions[a].identifier);


        var imagenode = document.createElement("img");
        imagenode.id = "auction_pic"+a.toString();
        imagenode.src = require('../static/'+source_of_image.url);
        imagenode.style.left = (10+550*a).toString()+'px';
        imagenode.onclick = function() {
          document.getElementById("lotdropdown").style.top = "0px";
          document.getElementById("lotnumber").innerHTML = "LOT "+a.toString();
          document.getElementById("lotimage").src = this.src;
          document.getElementById("lotinfo").innerHTML = "info";
          document.getElementById("lotessay").innerHTML = "";
        }
        auction_scroll.append(imagenode);
    
        var textnode = document.createElement("a");
        console.log(auctions[a].identifier);
        textnode.innerHTML = 
        "<pre> TITLE:  "+source_of_image.title+
        "\n\nARTIST:  "+source_of_image.artist+
        "\n\nYEAR:  "+source_of_image.year+
        "\n\nOWNER:  "+source_of_image.owner+
        "\n\n\nCURRENT HIGHEST BID:\n"+auctions[a].highestbid+
        "\n\nHIGHEST BIDDER:\n"+auctions[a].username+
        "</pre>";
        textnode.style.left = (250+550*a).toString()+'px';
        auction_scroll.append(textnode);
      }
      this.forceUpdate();
    }
  
    render(){
      return (
        <div>
          <div id = "lotdropdown" class = "lotdropdown">
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
          </div>
          <div class = 'title'>
            <a>auctions</a>
          </div>
          <a>Browse Lots</a>
          <div id = "auctionscroll" class = "auctionscroll">
          </div>
        </div>
      );
    }
}

export default AuctionAdmin
