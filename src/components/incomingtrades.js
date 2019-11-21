import React from 'react';
import MaterialTable from 'material-table';
//import EditIcon from 'material-ui/svg-icons/image/edit';
//import Delete from 'material-ui/svg-icons/action/delete';
import * as serverfuncs from '../serverfuncs';
import "./incomingtrades.css";

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
  }

  componentDidMount() {
    this.getIncomingTrades();
  }

  
  async getIncomingTrades() {
    const trades = await serverfuncs.getTrades();
    const details = await serverfuncs.getTradeDetails();
    totalTrades = 0;
    for(var trade in trades) {
      totalTrades++;
      var auctionNode = document.createElement("a");
      auctionNode.id = "trade"+trade.toString();
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
        expandTradeDropdown(this.id);
        // console.log(trade);
        // console.log(totalTrades);
        for(var t = 0; t < totalTrades; t++) {
          console.log(this.id.slice(5));
          if(t > parseInt(this.id.slice(5))) {
            try {
            console.log("TRADE SHIFTED");
            console.log(parseInt(document.getElementById("trade"+t.toString()).style.top));
            document.getElementById("trade"+t.toString()).style.top = 
            (parseInt(document.getElementById("trade"+t.toString()).style.top)+160).toString()+"px";
            } catch {}
          }
        }
      };

      var confirmNode = document.createElement("button");
      confirmNode.innerHTML = "confirm";
      auctionNode.append(confirmNode);

      var denyNode = document.createElement("button");
      denyNode.innerHTML = "deny";
      auctionNode.append(denyNode);

      document.getElementById("incomingtrades").append(auctionNode);

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