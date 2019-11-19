import React from 'react';
import MaterialTable from 'material-table';
import Button from '@material-ui/core/button';
import * as serverfuncs from '../serverfuncs';
import "./gallerydropdown.css";

var rows = [];
var read = false;
var divid = "";

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
    divid = this.props.identifier + "HistoryDropdown";
    this.getRows();
    this.state = stateBeg; 
  }

  lowerTable() {
    document.getElementById(divid).style.top = "0px";
  }

  raiseTable() {
    document.getElementById(divid).style.top = "-600px";
  }

  async getRows() {
    rows = [];
    const history = await serverfuncs.getHistory(this.props.identifier);
    for(var artwork of history) {
      rows.push(artwork);
    };
    this.state.data = rows;
    this.state.data = this.state.data.sort(function(a, b){return a.timestamp[0] > b.timestamp[0] ? 1 : -1});
    read = true;
    this.forceUpdate();
  }

  render() {
    const title = "History for \"" + this.props.identifier + "\"";
    return (
      <div>
        <Button onClick={this.lowerTable}><i>History</i></Button>
        <div id={divid} class="galleryDropdown">
          <a class="closebtn" onClick={this.raiseTable}>&times;</a>
          <p>&nbsp;</p>
          {read ? (
          <MaterialTable
            title={title}
            columns={this.state.columns}
            data={this.state.data}
          />
        ) : (<h1>loading...</h1>)} 
        </div> 
      </div>
    ); 
  }
}