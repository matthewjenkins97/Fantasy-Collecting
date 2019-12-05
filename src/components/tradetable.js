import React from 'react';
import MaterialTable from 'material-table';
//import EditIcon from 'material-ui/svg-icons/image/edit';
//import Delete from 'material-ui/svg-icons/action/delete';
import * as serverfuncs from '../serverfuncs';

var rows = [];
var read = false;

var stateBeg = {columns: [
      { title: 'Trade ID', field: 'tradeid'}, 
      { title: 'Buyer', field: 'buyer' },
      { title: 'Seller', field: 'seller' },
      { title: 'Offer', field: 'offer' },
    ],
    data: rows,
}

export default class TradeTable extends React.Component {
  constructor(props) {
    super(props);
    this.identifier = props.identifier;
    this.getRows();
    this.state = stateBeg; 
  }
  async getRows() {
    rows = [];
    const trades = await serverfuncs.getTradeDetails();
    for(var trade of trades) {
      if (trade.approved === 1) {
          rows.push(trade);
      }
    }
    this.state.data = rows;
    read = true;
    this.forceUpdate();
  }
  render() {
    const title = "Trade Details for " + this.identifier;
    return (
      <div>
      {read ? (
      <MaterialTable
        title={title}
        columns={this.state.columns}
        data={this.state.data}
      />
    ) : (<h1>loading...</h1>)} </div> ); 
  }
}