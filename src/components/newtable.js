import React from 'react';
import Button from '@material-ui/core/Button';
import MaterialTable from 'material-table';
//import EditIcon from 'material-ui/svg-icons/image/edit';
//import Delete from 'material-ui/svg-icons/action/delete';
import * as serverfuncs from '../serverfuncs';
import { default as Chatkit } from '@pusher/chatkit-server';
import './backgroundlogin.css'

var rows = [];
var read = false;

var stateBeg = {columns: [
      { title: 'Username', field: 'username' },
      { title: 'Password', field: 'hash' },
      { title: 'Name', field: 'name' },
      { title: 'Admin?', field: 'admin', type: 'numeric' },
      { title: 'Completed form?', field: 'formcompleted', type: 'numeric' },
      { title: 'Guilders', field: 'guilders', type: 'numeric' },
      { title: 'Microresearch Points', field: 'microresearchpoints', type: 'numeric' },
      { title: 'Blurb', field: 'blurb'},
    ],
    data: rows,
}

const chatkit = new Chatkit({
  instanceLocator: "v1:us1:f04ab5ec-b8fc-49ca-bcfb-c15063c21da8",
  key: "32b71a31-bcc2-4750-9cff-59640b74814e:hQq+MMcoDqpXgMK0aPNPcm8uFHFDRmNDWcYNeiP2Zjg="
})

export default class MaterialTableDemo extends React.Component {
  constructor(props) {
    super(props);
    this.getRows();
    this.state = stateBeg;
    document.body.className = "background";
  }

  createUser(username) {
    chatkit.createUser({
        id: username,
        name: username,
    })
    .then((currentUser) => {
        this.setState({
            currentUsername: username,
            currentId: username,
            currentView: 'chatApp'
        })
    }).catch((err) => {
             if(err.status === 400) {
            this.setState({
                currentUsername: username,
                currentId: username,
                currentView: 'chatApp'
            })
        } else {
            console.log(err.status);
        }
    });
}

  async getRows() {
    rows = [];
    const users = await serverfuncs.getAllUsers();
    for(var user of users) {
      var dict = {username: user.username, 
        hash: "*****", 
        name: user.name, 
        admin: user.admin, 
        formcompleted: user.formcompleted,
        guilders: user.guilders, 
        microresearchpoints: user.microresearchpoints,
        blurb: user.blurb
      };
        
      rows.push(dict);
    };
    this.state.data = rows;
    this.state.data = this.state.data.sort(function(a, b){return a.username[0] > b.username[0] ? 1 : -1});
    read = true;
    this.forceUpdate();
  }
  hidePasswords() {
    for(var row in this.state.data) {
      this.state.data[row].hash = "*****";
    }
  }
  render() {
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
                serverfuncs.createUser(newData);

                this.state.data.push(newData);
                this.state.data = this.state.data.sort(function(a, b){return a.username[0] > b.username[0] ? 1 : -1});
                this.setState({ ...this.state, ...this.state.data });
                this.createUser(newData.username);
                // this.hidePasswords();
                this.forceUpdate();
              }, 600);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                this.state.data = this.state.data.filter(function(value, index, arr){
                  return arr[index].username !== oldData.username;
                });
                serverfuncs.updateUserData(newData);

                this.state.data.push(newData);
                this.state.data = this.state.data.sort(function(a, b){return a.username[0] > b.username[0] ? 1 : -1});
                this.setState({ ...this.state, ...this.state.data });
                // this.hidePasswords();
                this.forceUpdate();
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
                this.forceUpdate();
              }, 600);
            }),
        }}
      />
    ) : (<h1>loading...</h1>)} </div> ); 
  }
}