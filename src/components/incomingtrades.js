import React from 'react';
import * as serverfuncs from '../serverfuncs';
import './incomingtrades.css';
import Notification from './notification';
import './backgroundlogin.css';
import Typography from '@material-ui/core/Typography';

class TradeDetails extends HTMLElement {
  index = 0;
  numofdetails = 0;
  expanded = false;
  constructor() {
    super();
  }
}
customElements.define('trade-details', TradeDetails);

class ExpandButton extends HTMLElement {
  index = 0;
  constructor() {
    super();
  }
}
customElements.define('expand-button', ExpandButton);

function expandTradeDropdown(id) {
  document.getElementById(id).style.height = '200px';
}
function closeTradeDropdown(id) {
  document.getElementById(id).style.height = '35px';
}
let totalTrades = 0;
export default class IncomingTrades extends React.Component {
  constructor(props) {
    super(props);
    document.body.className = 'background';
  }

  componentDidMount() {
    this.getIncomingTrades(this);
  }

  async getIncomingTrades(cRef) {
    for (let i = 0; i < totalTrades; i++) {
      try{
        document.getElementById('trade'+i).remove();
      } catch {}
    }
    const trades = await serverfuncs.getTrades();
    const details = await serverfuncs.getTradeDetails();
    totalTrades = 0;
    for (const trade in trades) {
      if (trades[trade].sellerapproved === 0 || trades[trade].buyerapproved === 0) continue;
      totalTrades++;

      const auctionNode = document.createElement('trade-details');
      auctionNode.id = 'trade'+trade.toString();
      auctionNode.index = trade;
      auctionNode.className = 'tradedropdown';
      auctionNode.style.color = 'white';
      auctionNode.style.top = (150 + trade * 40).toString()+'px';
      auctionNode.innerHTML = trades[trade].buyer + ' trading with ' + trades[trade].seller;

      const expandNode = document.createElement('expand-button');
      expandNode.innerHTML = 'expand';
      expandNode.className = 'expandbutton';
      expandNode.index = trade;
      expandNode.onclick = function() {
        const anode = document.getElementById('trade'+this.index.toString());
        if (anode.expanded) {
          anode.expanded = false;
          closeTradeDropdown(anode.id);
          for (let t = 0; t < totalTrades; t++) {
            if (t > parseInt(anode.id.slice(5))) {
              try {
              document.getElementById('trade'+t.toString()).style.top = (parseInt(document.getElementById('trade'+t.toString()).style.top)-170).toString()+'px';
              } catch {}
            }
          }
        } else {
          expandTradeDropdown(anode.id);
          for (let t = 0; t < totalTrades; t++) {
            if (t > parseInt(anode.id.slice(5))) {
              try {
              document.getElementById('trade'+t.toString()).style.top = (parseInt(document.getElementById('trade'+t.toString()).style.top)+170).toString()+'px';
              } catch {}
            }
          }
          anode.expanded = true;
        }
      };
      auctionNode.append(expandNode);

      const confirmNode = document.createElement('expand-button');
      confirmNode.index = trade;
      confirmNode.innerHTML = 'confirm';
      confirmNode.className = 'confirmbutton';
      confirmNode.onclick = async function() {
        await serverfuncs.approveTrade(trades[this.index].tradeid);
        // await serverfuncs.adminCancelTrade(trades[trade].tradeid);
        cRef.getIncomingTrades(cRef);
      };
      auctionNode.append(confirmNode);

      const denyNode = document.createElement('expand-button');
      denyNode.index = trade;
      denyNode.innerHTML = 'deny';
      denyNode.className = 'denybutton';
      denyNode.onclick = async function() {
        await serverfuncs.denyTrade(trades[this.index].tradeid);
        cRef.getIncomingTrades(cRef);
        serverfuncs.showNotification('Trade denied');
      };
      auctionNode.append(denyNode);

      document.getElementById('incomingtrades').append(auctionNode);

      const breakNode = document.createElement('br');
      document.getElementById('trade'+trade.toString()).append(breakNode);

      for (const detail in details) {
        if (details[detail].tradeid === trades[trade].tradeid) {
          const breakNode = document.createElement('br');
          document.getElementById('trade'+trade.toString()).append(breakNode);

          const detailNode = document.createElement('a');
          detailNode.text = details[detail].seller + ' -> ' + details[detail].offer + ' -> ' + details[detail].buyer;
          document.getElementById('trade'+trade.toString()).append(detailNode);
        }
      }
    }
    this.forceUpdate();
  }

  render() {
    return (
      <div style = {{textAlign: 'center'}}>
        <Notification/>
        <div className='title'>
          <Typography variant='h3'>Incoming Trades</Typography>
        </div>
        <div id = 'incomingtrades'></div>
      </div>
    );
  }
}
