import React from 'react';
import MaterialTable from 'material-table';
import Button from '@material-ui/core/button';
import * as serverfuncs from '../serverfuncs';
import "./gallerydropdown.css";

export default class HistoryTable extends React.Component {
  constructor(props) {
    super(props);

    // stuff for memory of table
    this.rows = [];
    this.read = false;
    this.getRows = this.getRows.bind(this);

    // needs to be done for divid and other this variables to be preserved
    this.lowerTable = this.lowerTable.bind(this)
    this.raiseTable = this.raiseTable.bind(this)

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
    document.getElementById(this.divid).style.top = "0px";
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
          />
        ) : (<h1>loading...</h1>)} 
        </div> 
      </div>
    ); 
  }
}