import React from 'react';
import * as serverfuncs from '../serverfuncs';
import "./incomingtrades.css";

class TradeDetails extends HTMLElement {
  index=0;
  numofdetails=0;
  expanded=false;
  constructor() {
    super();
  }
}
customElements.define('trade-details', TradeDetails);

function expandTradeDropdown(id) {
  document.getElementById(id).style.height = "200px";
}
function closeTradeDropdown(id) {
  document.getElementById(id).style.height = "30px";
}
var totalTrades = 0;
export default class IncomingTrades extends React.Component {
  constructor(props) {
    super(props);
    document.body.className = "";
  }

  componentDidMount() {
    this.getIncomingTrades(this);
  }

  callForceUpdate() {
    this.forceUpdate();
  }

  async getIncomingTrades(c_ref) {
    const trades = await serverfuncs.getTrades();
    const details = await serverfuncs.getTradeDetails();
    totalTrades = 0;
    for(var trade in trades) {
      totalTrades++;

      var auctionNode = document.createElement("trade-details");
      auctionNode.id = "trade"+trade.toString();
      auctionNode.index = trade;
      auctionNode.className = "tradedropdown";
      auctionNode.style.color = "white";
      auctionNode.style.backgroundColor = "rgba(0, 0, 0, .7)";
      auctionNode.style.position = "absolute";
      auctionNode.style.width = "80%";
      auctionNode.style.left = "10%";
      auctionNode.style.fontSize = "20px";
      auctionNode.style.top = (100 + trade * 40).toString()+"px";
      auctionNode.innerHTML = 
      trades[trade].buyer + " <==> " + trades[trade].seller;
      auctionNode.onclick = function () {
        if(this.expanded) {
          this.expanded = false;
          closeTradeDropdown(this.id);
          for(var t = 0; t < totalTrades; t++) {
            console.log(this.id.slice(5));
            if(t > parseInt(this.id.slice(5))) {
              try {
              console.log("TRADE SHIFTED");
              console.log(parseInt(document.getElementById("trade"+t.toString()).style.top));
              document.getElementById("trade"+t.toString()).style.top = 
              (parseInt(document.getElementById("trade"+t.toString()).style.top)-170).toString()+"px";
              } catch {}
            }
          }
        }
        else {
          expandTradeDropdown(this.id);
          for(var t = 0; t < totalTrades; t++) {
            console.log(this.id.slice(5));
            if(t > parseInt(this.id.slice(5))) {
              try {
              console.log("TRADE SHIFTED");
              console.log(parseInt(document.getElementById("trade"+t.toString()).style.top));
              document.getElementById("trade"+t.toString()).style.top = 
              (parseInt(document.getElementById("trade"+t.toString()).style.top)+170).toString()+"px";
              } catch {}
            }
          }
          this.expanded = true;
        }
      };

      var confirmNode = document.createElement("button");
      confirmNode.innerHTML = "confirm";
      confirmNode.style.backgroundColor = "green";
      confirmNode.onclick = async function() {
        await serverfuncs.approveTrade(trades[trade].tradeid);
        await serverfuncs.adminCancelTrade(trades[trade].tradeid);
        c_ref.callForceUpdate();
      }
      auctionNode.append(confirmNode);

      var denyNode = document.createElement("button");
      denyNode.innerHTML = "deny";
      denyNode.style.backgroundColor = "red";
      denyNode.onclick = async function() {
        await serverfuncs.adminCancelTrade(trades[trade].tradeid);
        c_ref.callForceUpdate();
      }
      auctionNode.append(denyNode);

      document.getElementById("incomingtrades").append(auctionNode);

      var breakNode = document.createElement("br");
      document.getElementById("trade"+trade.toString()).append(breakNode);

      for(var detail in details) {
        if(details[detail].tradeid === trades[trade].tradeid) {

          var breakNode = document.createElement("br");
          document.getElementById("trade"+trade.toString()).append(breakNode);

          var detailNode = document.createElement("a");
          detailNode.text = details[detail].offer + ">>" +details[detail].buyer;
          document.getElementById("trade"+trade.toString()).append(detailNode);
        }
      }
    }
    this.forceUpdate();
  }

  render() {
    return (
      <div style = {{textAlign: "center "}}>
        <a style = {{fontSize:"30px"}}>Incoming Trades</a>
        <div id = "incomingtrades"></div>
      </div>
    )
  }
}