import React from 'react';
import MaterialTable from 'material-table';
//import EditIcon from 'material-ui/svg-icons/image/edit';
//import Delete from 'material-ui/svg-icons/action/delete';
import * as serverfuncs from '../serverfuncs';

var rows = [];
var read = false;

var stateBeg = {columns: [
      { title: 'Username', field: 'username' },
      { title: 'Name', field: 'name' },
      { title: 'Money', field: 'money' },
      { title: 'Artworks', field: 'artworks', type: 'numeric' },
      { title: 'Value', field: 'value', type: 'numeric' },
      { title: 'Kudos', field: 'kudos' },
    ],
    data: rows,
}

export default class MaterialTableDemo extends React.Component {
  constructor(props) {
    super(props);
    this.getRows();
    this.state = stateBeg; 
  }
  async getRows() {
    rows = [];
    const users = await serverfuncs.getAllUsers();
    for(var user of users) {
      console.log(user);
      var dict = {username: user.username, 
        name: user.name, 
        money: user.guilders, 
        artworks: user.numofpaintings,
        value: 0,
        kudos: user.microresearchpoints};
      rows.push(dict);
    };
    this.state.data = rows;
    this.state.data = this.state.data.sort(function(a, b){return a.username[0] > b.username[0] ? 1 : -1});
    read = true;
    this.forceUpdate();
  }
  render() {
    // const [state, setState] = React.useState({
    //   columns: [
    //       { title: 'Username', field: 'username' },
    //     { title: 'Name', field: 'name' },
    //     { title: 'Money', field: 'money' },
    //     { title: 'Artworks', field: 'artworks', type: 'numeric' },
    //     { title: 'Value', field: 'value', type: 'numeric' },
    //     { title: 'Kudos', field: 'kudos' },
    //   ],
    //   data: rows,//[
    //   //   { username: 'jopatrny', name: 'Julia Opatrny', money: 9000, paintings: 5, value: 200, kudos: 50 },
    //   //   { username: 'dholley', name: 'Donald Holley', money: 4000, paintings: 6, value: 400, kudos: 35 },
    //   //   { username: 'mjenkins', name: 'Matt Jenkins', money: 1500, paintings: 8, value: 350, kudos: 85 },
    //   // ],
    // });
    return (
      <div>
      {read ? (
      <MaterialTable
        title="Users"
        columns={this.state.columns}
        data={this.state.data}
        editable={{
          onRowAdd: newData =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                this.state.data.push(newData);
                this.state.data = this.state.data.sort(function(a, b){return a.username[0] > b.username[0] ? 1 : -1});
                this.setState({ ...this.state, ...this.state.data });
                serverfuncs.createUser(newData);
              }, 600);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise(resolve => {
              //this.data[this.data.indexOf(oldData)] = newData;
              setTimeout(() => {
                resolve();
                this.state.data = this.state.data.filter(function(value, index, arr){
                  return arr[index].username !== oldData.username;
                });
                this.state.data.push(newData);
                this.state.data = this.state.data.sort(function(a, b){return a.username[0] > b.username[0] ? 1 : -1});
                this.setState({ ...this.state, ...this.state.data });
                serverfuncs.updateUserData(newData);
              }, 600);
            }),
          onRowDelete: oldData =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                this.state.data = this.state.data.filter(function(value, index, arr){
                  return arr[index].username !== oldData.username;
                });
                this.state.data = this.state.data.sort(function(a, b){return a.username[0] > b.username[0] ? 1 : -1});
                this.setState({ ...this.state, ...this.state.data });
                serverfuncs.deleteUser(oldData.username);
              }, 600);
            }),
        }}
      />
    ) : (<h1>loading...</h1>)} </div> ); 
  }
}