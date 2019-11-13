import React from 'react';
import MaterialTable from 'material-table';
//import EditIcon from 'material-ui/svg-icons/image/edit';
//import Delete from 'material-ui/svg-icons/action/delete';
import * as serverfuncs from '../serverfuncs';

var rows = [];
var read = false;

var stateBeg = {columns: [
      { title: 'Identifier', field: 'identifier' },
      { title: 'Title', field: 'title' },
      { title: 'Artist', field: 'artist' },
      { title: 'Year', field: 'year', type: 'numeric'},
      { title: 'Theoretical Price', field: 'theoreticalprice', type: 'numeric' },
      { title: 'Actual Price', field: 'actualprice', type: 'numeric'},
      { title: 'Hidden', field: 'hidden'},
      { title: 'Owner', field: 'owner' },
      { title: 'URL', field: 'url' },
    ],
    data: rows,
}

export default class ArtworkTable extends React.Component {
  constructor(props) {
    super(props);
    this.getRows();
    this.state = stateBeg; 
  }
  async getRows() {
    rows = [];
    const artworks = await serverfuncs.getAllArtworks();
    for(var artwork of artworks) {
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
    this.state.data = this.state.data.sort(function(a, b){return a.title[0] > b.title[0] ? 1 : -1});
    read = true;
    this.forceUpdate();
  }
  render() {
    return (
      <div>
      {read ? (
      <MaterialTable
        title="Artworks"
        columns={this.state.columns}
        data={this.state.data}
        editable={{
          onRowAdd: newData =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                this.state.data.push(newData);
                this.state.data = this.state.data.sort(function(a, b){return a.title[0] > b.title[0] ? 1 : -1});
                this.setState({ ...this.state, ...this.state.data });
                serverfuncs.createArtwork(newData);
              }, 600);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise(resolve => {
              //this.data[this.data.indexOf(oldData)] = newData;
              setTimeout(() => {
                resolve();
                this.state.data = this.state.data.filter(function(value, index, arr){
                  return arr[index].title !== oldData.title;
                });
                this.state.data.push(newData);
                this.state.data = this.state.data.sort(function(a, b){return a.title[0] > b.title[0] ? 1 : -1});
                this.setState({ ...this.state, ...this.state.data });
                serverfuncs.updateArtwork(newData);
              }, 600);
            }),
          onRowDelete: oldData =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                this.state.data = this.state.data.filter(function(value, index, arr){
                  return arr[index].title !== oldData.title;
                });
                this.state.data = this.state.data.sort(function(a, b){return a.title[0] > b.title[0] ? 1 : -1});
                this.setState({ ...this.state, ...this.state.data });
                serverfuncs.deleteArtwork(oldData.identifier);
              }, 600);
            }),
        }}
      />
    ) : (<h1>loading...</h1>)} </div> ); 
  }
}