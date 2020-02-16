import React from 'react';
import MaterialTable from 'material-table';
import Button from '@material-ui/core/button';
import * as serverfuncs from '../serverfuncs';
import './gallerydropdown.css';

export default class MicroresearchTable extends React.Component {
  constructor(props) {
    super(props);

    // stuff for memory of table
    this.rows = [];
    this.read = false;
    this.getRows = this.getRows.bind(this);

    // needs to be done for divid to be preserved
    this.lowerTable = this.lowerTable.bind(this);
    this.raiseTable = this.raiseTable.bind(this);
    this.divid = this.props.identifier + 'MicroresearchDropdown';

    this.getRows();
    this.state = {columns: [
      {title: 'User', field: 'username'},
      {title: 'Microresearch', field: 'information'},
      {title: 'Timestamp', field: 'timestamp'},
    ],
    data: this.rows,
    };
  }

  lowerTable() {
    document.getElementById(this.divid).style.top = '50px';
  }

  raiseTable() {
    document.getElementById(this.divid).style.top = '-600px';
  }

  async getRows() {
    // used in render to print name of artwork rather than the identifier
    this.artwork = await serverfuncs.getArtworkInfo(this.props.identifier);
    this.artworkName = this.artwork.title;

    this.rows = [];
    const artworkMicroresearch = await serverfuncs.getMicroresearch(this.props.identifier);
    for (const microresearch of artworkMicroresearch) {
      if (microresearch.identifier === this.props.identifier) {
        microresearch.timestamp = new Date(microresearch.timestamp).toLocaleString();
        this.rows.push(microresearch);
      }
    };
    this.state.data = this.rows;
    this.state.data = this.state.data.sort( function(a, b) {
      return new Date(a.date) > new Date(b.date) ? 1 : -1;
    });
    this.read = true;
    this.forceUpdate();
  }

  render() {
    const title = 'Microresearch for \"' + this.artworkName + '\"';
    return (
      <div>
        <Button onClick={this.lowerTable}><i>Show Microresearch</i></Button>
        <div id={this.divid} class='galleryDropdown'>
          <a class='closebtn' onClick={this.raiseTable}>&times;</a>
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
