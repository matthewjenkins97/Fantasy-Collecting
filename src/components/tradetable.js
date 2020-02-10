import React from 'react';
import MaterialTable from 'material-table';
import "./gallerydropdown.css";
import * as serverfuncs from '../serverfuncs';

export default class TradeTable extends React.Component {
  constructor(props) {
    super(props);

    this.rows = [];
    this.read = false;

    this.tradeid = props.identifier;
    this.divid = props.identifier + "TradeDropdown"

    this.getRows = this.getRows.bind(this);

    this.lowerTable = this.lowerTable.bind(this)
    this.raiseTable = this.raiseTable.bind(this)

    this.getRows();
    this.state = {columns: [
        { title: 'Buyer', field: 'buyer' },
        { title: 'Seller', field: 'seller' },
        { title: 'Offer', field: 'offer' },
      ],
      data: this.rows,
    }; 
  }

  lowerTable() {
    document.getElementById(this.divid).style.top = "0px";
  }

  raiseTable() {
    document.getElementById(this.divid).style.top = "-600px";
  }

  async getRows() {
    this.rows = [];
    const trades = await serverfuncs.getTradeDetails();
    for(var trade of trades) {
      // console.log(trade.tradeid)
      if ((trade.archived === 1) && (trade.tradeid === this.tradeid)) {
        this.rows.push(trade);
      }
    }
    this.state.data = this.rows;
    this.read = true;

    // document.getElementById(this.divid).style.top = "50px";

    this.forceUpdate();
  }

  render() {
    const title = "Trade Details for " + this.tradeid;
    return (
      <div id={this.divid} class="tradeTableDropdown">
        <a class="closebtn" onClick={this.raiseTable}>&times;</a>
        {this.read ? (
        <MaterialTable
          title={title}
          columns={this.state.columns}
          data={this.state.data}
        />
      ) : (<h1>loading...</h1>)} 
      </div> 
    ); 
  }
}