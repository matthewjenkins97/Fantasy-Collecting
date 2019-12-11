import React from 'react';
import MaterialTable from 'material-table';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/button';
import * as serverfuncs from '../serverfuncs';
import "./gallerydropdown.css";

// class TradeTable extends React.Component {
//   constructor(props) {
//     super(props);

//     this.rows = [];
//     this.read = false;

//     this.tradeid = props.identifier;
//     this.divid = props.identifier + "TradeDropdown"

//     this.getRows = this.getRows.bind(this);
//     this.getRows();
//     this.state = {columns: [
//         { title: 'Buyer', field: 'buyer' },
//         { title: 'Seller', field: 'seller' },
//         { title: 'Offer', field: 'offer' },
//       ],
//       data: this.rows,
//     }; 
//   }

//   async getRows() {
//     this.rows = [];
//     const trades = await serverfuncs.getTradeDetails();
//     for(var trade of trades) {
//       console.log(trade.tradeid)
//       if ((trade.archived === 1) && (trade.tradeid === this.tradeid)) {
//         this.rows.push(trade);
//       }
//     }
//     this.state.data = this.rows;
//     this.read = true;
//     this.forceUpdate();
//   }

//   render() {
//     const title = "Trade Details for " + this.tradeid;
//     return (
//       <div>
//       {this.read ? (
//       <MaterialTable
//         title={title}
//         columns={this.state.columns}
//         data={this.state.data}
//       />
//     ) : (<h1>loading...</h1>)} </div> ); 
//   }
// }

export default class HistoryTable extends React.Component {
  constructor(props) {
    super(props);

    // stuff for memory of table
    this.rows = [];
    this.read = false;

    // this.tradeTableState = false;
    // this.currentTradeID = undefined;

    this.getRows = this.getRows.bind(this);

    // needs to be done for divid and other this variables to be preserved
    this.lowerTable = this.lowerTable.bind(this)
    this.raiseTable = this.raiseTable.bind(this)
    // this.showTradeTable = this.showTradeTable.bind(this);

    this.divid = this.props.identifier + "HistoryDropdown"

    this.getRows();
    this.state = {columns: [
      { title: 'Date', field: 'timestamp'},
      { title: 'Buyer', field: 'buyer' },
      { title: 'Seller', field: 'seller' },
      { title: 'Selling Price', field: 'price', type: 'numeric'},
    ],
    data: this.rows,
    }; 
  }

  lowerTable() {
    document.getElementById(this.divid).style.top = "50px";
  }

  raiseTable() {
    document.getElementById(this.divid).style.top = "-600px";
  }

  async getRows() {
    this.rows = [];
    const history = await serverfuncs.getHistory(this.props.identifier);
    for(var artwork of history) {
      artwork.timestamp = new Date(artwork.timestamp).toLocaleString();
      this.rows.push(artwork);
    };
    this.state.data = this.rows;
    this.state.data = this.state.data.sort(function(a, b){return a.timestamp[0] > b.timestamp[0] ? 1 : -1});
    this.read = true;
    this.forceUpdate();
  }

  // showTradeTable(tradeid) {
  //   if (this.tradeTableState) {
  //     this.tradeTableState = false;
  //   } else {
  //     this.tradeTableState = true;
  //   }
  //   console.log(this.tradeTableState);
  //   this.currentTradeID = tradeid;
  // }

  render() {
    const title = "History for \"" + this.props.identifier + "\"";
    return (
      <div>
        <Button onClick={this.lowerTable}><i>History</i></Button>
        <div id={this.divid} class="galleryDropdown">
          <a class="closebtn" onClick={this.raiseTable}>&times;</a>
          <p>&nbsp;</p>
          {this.read ? (
          <MaterialTable
            title={title}
            columns={this.state.columns}
            data={this.state.data}
            actions={[
            {
              icon: SearchIcon,
              tooltip: 'Trade Information',
              onClick: (event, rowData) => {
                if (rowData.tradeid !== null) {
                  // this.showTradeTable(rowData.tradeid);
                } else {
                  alert("No trade information found.")
                }
              }
            }
          ]}
          />
          ) : (<h1>loading...</h1>)} 
          {/* {this.tradeTableState &&
          <TradeTable identifier={this.currentTradeID} />} */}
        </div> 
      </div>
    ); 
  }
}