import React from 'react';
import MaterialTable from 'material-table';
//import EditIcon from 'material-ui/svg-icons/image/edit';
//import Delete from 'material-ui/svg-icons/action/delete';
import * as serverfuncs from '../serverfuncs';

var rows = [];
var read = false;

var stateBeg = {columns: [
      { title: 'Date', field: 'timestamp'},
      { title: 'Buyer', field: 'buyer' },
      { title: 'Seller', field: 'seller' },
      { title: 'Selling Price', field: 'price', type: 'numeric'},
    ],
    data: rows,
}

export default class HistoryTable extends React.Component {
  constructor(props) {
    super(props);
    this.getRows();
    this.state = stateBeg; 
  }
  async getRows() {
    rows = [];
    const history = await serverfuncs.getHistory(this.props.identifier);
    for(var artwork of history) {
      // console.log(user);
      // var dict = {title: user.title, 
      //   name: user.name, 
      //   money: user.guilders, 
      //   artworks: user.numofpaintings,
      //   value: 0,
      //   kudos: user.microresearchpoints,
      // };
        
      rows.push(artwork);
    };
    this.state.data = rows;
    this.state.data = this.state.data.sort(function(a, b){return a.timestamp[0] > b.timestamp[0] ? 1 : -1});
    read = true;
    this.forceUpdate();
  }
  render() {
    return (
      <div>
      {read ? (
      <MaterialTable
        title="History"
        columns={this.state.columns}
        data={this.state.data}
      />
    ) : (<h1>loading...</h1>)} </div> ); 
  }
}