import React from 'react';
import MaterialTable from 'material-table';
//import EditIcon from 'material-ui/svg-icons/image/edit';
//import Delete from 'material-ui/svg-icons/action/delete';
import * as serverfuncs from '../serverfuncs';
import Check from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

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
    this.state.data = this.state.data.sort(function(a, b){return a.tradeid[0] > b.tradeid[0] ? 1 : -1});
    read = true;
    this.forceUpdate();
  }
  render() {
    return (
      <div>
      {read ? (
      <MaterialTable
        title="Incoming Trades"
        columns={this.state.columns}
        data={this.state.data}
        actions={[
          {icon: Check,
          tooltip: 'Confirm Trade',
          onClick: (event, rowData) => {
            serverfuncs.approveTrade(rowData.tradeid);
            console.log('Trade confirmed')
            // then update table
            // this.getRows();

          }},
          {icon: CloseIcon,
          tooltip: 'Deny Trade',
          onClick: (event, rowData) => {
            console.log('Trade denied')
            serverfuncs.denyTrade(rowData.tradeid);
            // this.getRows();
          }},
        ]}
      />
    ) : (<h1>loading...</h1>)} </div> ); 
  }
}