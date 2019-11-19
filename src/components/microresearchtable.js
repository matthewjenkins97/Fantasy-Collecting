import React from 'react';
import MaterialTable from 'material-table';
import Button from '@material-ui/core/button';
import * as serverfuncs from '../serverfuncs';
import './gallerydropdown.css';
import { Typography } from '@material-ui/core';

var rows = [];
var read = false;

var divid = "";

var stateBeg = {columns: [
      { title: 'User', field: 'username' },
      { title: 'Microresearch', field: 'information' },
      { title: 'Timestamp', field: 'timestamp'},
    ],
    data: rows,
}

export default class MicroresearchTable extends React.Component {
  constructor(props) {
    super(props);
    divid = this.props.identifier + "MicroresearchDropdown";
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
    const artworkMicroresearch = await serverfuncs.getMicroresearch(this.props.identifier);
    for(var microresearch of artworkMicroresearch) {
      rows.push(microresearch);
    };
    this.state.data = rows;
    this.state.data = this.state.data.sort(function(a, b){return a.date[0] > b.date[0] ? 1 : -1});
    read = true;
    this.forceUpdate();
  }

  render() {
    const title = "Microresearch for \"" + this.props.identifier + "\"";
    return (
      <div>
        <Button onClick={this.lowerTable}><i>Show Microresearch</i></Button>
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