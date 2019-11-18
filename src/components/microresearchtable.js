import React from 'react';
import MaterialTable from 'material-table';
//import EditIcon from 'material-ui/svg-icons/image/edit';
//import Delete from 'material-ui/svg-icons/action/delete';
import * as serverfuncs from '../serverfuncs';
import './gallerydropdown.css';

var rows = [];
var read = false;

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
    this.getRows();
    this.state = stateBeg; 
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
    return (
      <div>
      {read ? (
      <MaterialTable
        title="Microresearch"
        columns={this.state.columns}
        data={this.state.data}
      />
    ) : (<h1>loading...</h1>)}
    </div>); 
  }
}