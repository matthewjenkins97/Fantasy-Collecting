import React from 'react';
import MaterialTable from 'material-table';
import * as serverfuncs from '../serverfuncs';
import ImageDrop from './imagedrop';
import './backgroundlogin.css';
import { TablePagination } from '@material-ui/core';
import Button from '@material-ui/core/Button';

let rows = [];
let read = false;

const stateBeg = {columns: [
  {title: 'Identifier', field: 'identifier'},
  {title: 'Title', field: 'title'},
  {title: 'Artist', field: 'artist'},
  {title: 'Year', field: 'year', type: 'numeric'},
  {title: 'Theoretical Price', field: 'theoreticalprice', type: 'numeric'},
  {title: 'Actual Price', field: 'actualprice', type: 'numeric'},
  {title: 'Rateable?', field: 'rateable'},
  {title: 'Owner', field: 'owner'},
  {title: 'URL', field: 'url'},
],
data: rows,
};

export default class ArtworkTable extends React.Component {
  constructor(props) {
    super(props);
    this.getRows();
    this.state = stateBeg;
    document.body.className = 'background';
  }
  async getRows() {
    rows = [];
    const artworks = await serverfuncs.getAllArtworks();
    for (const artwork of artworks) {
      rows.push(artwork);
    };
    this.state.data = rows;
    this.state.data = this.state.data.sort(function(a, b) {
      return a.identifier[0] > b.identifier[0] ? 1 : -1;
    });
    read = true;
    this.forceUpdate();
  }
  render() {
    return (
      <div>
        {read ? (
        <div>
          <MaterialTable
            title='Artworks'
            components={{
              Pagination: props => (
                <div>
                  <TablePagination
                    {...props}
                    />
                </div>
              )
            }}
            columns={this.state.columns}
            data={this.state.data}
            editable={{
              onRowAdd: (newData) =>
                new Promise((resolve) => {
                  setTimeout(() => {
                    resolve();
                    this.state.data.push(newData);
                    this.state.data = this.state.data.sort(function(a, b) {
                      return a.identifier[0] > b.identifier[0] ? 1 : -1;
                    });
                    this.setState({...this.state, ...this.state.data});
                    serverfuncs.createArtwork(newData);
                    this.forceUpdate();
                  }, 600);
                }),
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve) => {
                  setTimeout(() => {
                    resolve();
                    this.state.data = this.state.data.filter(function(value, index, arr) {
                      return arr[index].identifier !== oldData.identifier;
                    });
                    this.state.data.push(newData);
                    this.state.data = this.state.data.sort(function(a, b) {
                      return a.identifier[0] > b.identifier[0] ? 1 : -1;
                    });
                    this.setState({...this.state, ...this.state.data});
                    serverfuncs.updateArtwork(newData);
                    this.forceUpdate();
                  }, 600);
                }),
              onRowDelete: (oldData) =>
                new Promise((resolve) => {
                  setTimeout(() => {
                    resolve();
                    this.state.data = this.state.data.filter(function(value, index, arr) {
                      return arr[index].identifier !== oldData.identifier;
                    });
                    this.state.data = this.state.data.sort(function(a, b) {
                      return a.identifier[0] > b.identifier[0] ? 1 : -1;
                    });
                    this.setState({...this.state, ...this.state.data});
                    serverfuncs.deleteArtwork(oldData.identifier);
                    this.forceUpdate();
                  }, 600);
                }),
            }}
          />
          <ImageDrop/>
        </div>
    ) : (<h1>Loading...</h1>)} </div> );
  }
}
