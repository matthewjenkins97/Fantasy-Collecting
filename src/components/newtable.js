import React from 'react';
import Button from '@material-ui/core/Button';
import MaterialTable from 'material-table';
//import EditIcon from 'material-ui/svg-icons/image/edit';
//import Delete from 'material-ui/svg-icons/action/delete';
import * as serverfuncs from '../serverfuncs';

var rows = [];
var read = false;

var stateBeg = {columns: [
      { title: 'Username', field: 'username' },
      { title: 'Password', field: 'hash' },
      { title: 'Name', field: 'name' },
      { title: 'Admin', field: 'admin', type: 'numeric' },
      { title: 'Guilders', field: 'guilders', type: 'numeric' },
      { title: 'Microresearch Points', field: 'microresearchpoints', type: 'numeric' },
      { title: 'Number of Artworks', field: 'numofpaintings', type: 'numeric' },
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
        hash: user.hash, 
        name: user.name, 
        admin: user.admin, 
        guilders: user.guilders, 
        numofpaintings: user.numofpaintings,
        microresearchpoints: user.microresearchpoints,
      };
        
      rows.push(dict);
    };
    this.state.data = rows;
    this.state.data = this.state.data.sort(function(a, b){return a.username[0] > b.username[0] ? 1 : -1});
    read = true;
    this.forceUpdate();
  }
  goToGallery() {

  }
  render() {
    return (
      <div>
      {read ? (
      <MaterialTable
        title="Users"
        columns={this.state.columns}
        data={this.state.data}
        // actions={[
        //   {
        //     icon: 'save',
        //     tooltip: 'Save User',
        //     //onClick: (event, rowData) => alert("You saved " + rowData.name)
        //   }
        // ]}
        // actions={[
        //   {
        //     icon: () => 
        //     <Button
        //     onClick={() => function() {}}
        //     color="primary"
        //     variant="contained"
        //     style={{textTransform: 'none'}}
        //     size="small"
        //     >
        //     View Gallery
        //     </Button>,
        //   },
          //{
            // icon: props => (
            // <Button
            //   onClick={(event, rowData) =>
            //     console.log("add user", rowData, props)
            //   }
            // >
            //   Add New User
            // </Button>
          // ),
            // tooltip: "Add New User",
            // isFreeAction: true,
            // onClick: (event, rowData) =>
            //   console.log("You are editing " + rowData.fname)
          //},
        //]}
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