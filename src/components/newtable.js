import React from 'react';
import MaterialTable from 'material-table';
import SearchIcon from '@material-ui/icons/Search';
import * as serverfuncs from '../serverfuncs';
import {default as Chatkit} from '@pusher/chatkit-server';
import './backgroundlogin.css';
import './gallerydropdown.css';

const chatkit = new Chatkit({
  instanceLocator: 'v1:us1:f04ab5ec-b8fc-49ca-bcfb-c15063c21da8',
  key: '32b71a31-bcc2-4750-9cff-59640b74814e:hQq+MMcoDqpXgMK0aPNPcm8uFHFDRmNDWcYNeiP2Zjg=',
});

class MicroresearchTable extends React.Component {
  constructor(props) {
    super(props);

    // stuff for memory of table
    this.rows = [];
    this.read = false;
    this.getRows = this.getRows.bind(this);

    // needs to be done for divid to be preserved
    this.lowerTable = this.lowerTable.bind(this);
    this.raiseTable = this.raiseTable.bind(this);
    this.divid = this.props.username + 'MicroresearchDropdown';

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
    this.rows = [];
    this.username = this.props.username;
    const artworkMicroresearch = await serverfuncs.getMicroresearch(this.props.username);
    for (const microresearch of artworkMicroresearch) {
      if (microresearch.username === this.props.username) {
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
    const title = this.username + '\'s Microresearch';
    return (
      <div>
        <div id={this.divid} class='galleryDropdownAdmin'>
          <a class='closebtn' onClick={this.raiseTable}>&times;</a>
          <p>&nbsp;</p>
          {this.read ? (
          <MaterialTable
            title={title}
            columns={this.state.columns}
            data={this.state.data}
          />
        ) : (<h1>Loading...</h1>)}
        </div>
      </div>
    );
  }
}

export default class MaterialTableDemo extends React.Component {
  constructor(props) {
    super(props);

    this.rows = [];
    this.read = false;

    // populated in getRows()
    this.microresearchids = [];

    this.stateBeg = {columns: [
      {title: 'Username', field: 'username'},
      {title: 'Password', field: 'hash'},
      {title: 'Name', field: 'name'},
      {title: 'Admin?', field: 'admin', type: 'numeric'},
      {title: 'Completed form?', field: 'formcompleted', type: 'numeric'},
      {title: 'Guilders', field: 'guilders', type: 'numeric'},
      {title: 'Points', field: 'microresearchpoints', type: 'numeric'},
      {title: 'Blurb', field: 'blurb'},
    ],
    data: this.rows,
    };

    this.getRows = this.getRows.bind(this);

    this.getRows();

    this.state = this.stateBeg;
    document.body.className = 'background';
  }

  createUser(username) {
    chatkit.createUser({
      id: username,
      name: username,
    }).then((currentUser) => {
      this.setState({
        currentUsername: username,
        currentId: username,
        currentView: 'chatApp',
      });
    }).catch((err) => {
      if (err.status === 400) {
        this.setState({
          currentUsername: username,
          currentId: username,
          currentView: 'chatApp',
        });
      } else {
        console.error(err.status);
      }
    });
  }

  async getRows() {
    this.rows = [];
    const users = await serverfuncs.getAllUsers();
    for (const user of users) {
      const microresearchIdentifier = user.username + 'MicroresearchDropdown'
      const dict = {username: user.username,
        hash: '*****',
        name: user.name,
        admin: user.admin,
        formcompleted: user.formcompleted,
        guilders: user.guilders,
        microresearchpoints: user.microresearchpoints,
        blurb: user.blurb,
        // used for searching by microresearch
        id: microresearchIdentifier,
      };
      this.rows.push(dict);
      this.microresearchids.push(dict.username);
    };
    this.state.data = this.rows;
    this.state.data = this.state.data.sort(function(a, b) {
      return a.username[0] > b.username[0] ? 1 : -1;
    });
    this.read = true;
    this.forceUpdate();
  }

  hidePasswords() {
    for (const row in this.state.data) {
      this.state.data[row].hash = '*****';
    }
  }

  render() {
    return (
      <div>
        {this.read ? (
      <MaterialTable
        title='Users'
        columns={this.state.columns}
        data={this.state.data}
        actions={[
          {
            icon: SearchIcon,
            tooltip: 'User Microresearch',
            onClick: (event, rowData) => {
              document.getElementById(rowData.id).style.top = '50px';
            },
          },
        ]}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve) => {
              setTimeout(() => {
                resolve();
                serverfuncs.createUser(newData);
                this.state.data.push(newData);
                this.state.data = this.state.data.sort(function(a, b) {
                  return a.username[0] > b.username[0] ? 1 : -1;
                });
                this.setState({...this.state, ...this.state.data});
                this.createUser(newData.username);
                // this.hidePasswords();
                this.forceUpdate();
              }, 600);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve) => {
              setTimeout(() => {
                resolve();
                this.state.data = this.state.data.filter(function(value, index, arr) {
                  return arr[index].username !== oldData.username;
                });
                serverfuncs.updateUserData(newData);
                this.state.data.push(newData);
                this.state.data = this.state.data.sort(function(a, b) {
                  return a.username[0] > b.username[0] ? 1 : -1;
                });
                this.setState({...this.state, ...this.state.data});
                // this.hidePasswords();
                this.forceUpdate();
              }, 600);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve) => {
              setTimeout(() => {
                resolve();
                this.state.data = this.state.data.filter(function(value, index, arr) {
                  return arr[index].username !== oldData.username;
                });
                this.state.data = this.state.data.sort(function(a, b) {
                  return a.username[0] > b.username[0] ? 1 : -1;
                });
                this.setState({...this.state, ...this.state.data});
                serverfuncs.deleteUser(oldData.username);
                this.forceUpdate();
              }, 600);
            }),
        }}
      />
    ) : (<h1>Loading...</h1>)}
        {this.microresearchids.map((username) => (
          <MicroresearchTable username={username} />
        ))}
      </div> );
  }
}
