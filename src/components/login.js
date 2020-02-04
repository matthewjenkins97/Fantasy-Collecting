import React, { useState } from "react";
import { Redirect } from 'react-router-dom';
import { View } from "react-native";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Appbar from '../components/appbar';
import { MD5 } from '../../src/md5';
import './backgroundlogin.css';
import * as serverfuncs from '../serverfuncs';

export default class Login extends React.Component{
  constructor(props) {
    super(props);
    this.state = { values: {username: '', password: '',
      gotoadmin: false,
      gotostudent: false}};
    this.handleChange = this.handleChange.bind(this);
    document.body.className = "background";
    if(localStorage.getItem('username') !== 'undefined') {
      this.logBackInUser();
    }
  };

  handleChange(event) {
    this.setState({username: event.target.username});
    this.setState({password: event.target.password});
  }
  
  logBackInUser = async () => {
    const stringName = localStorage.getItem('username');
    const response = await fetch('http://fantasycollecting.hamilton.edu/api/users/' + stringName);
    const myJson = await response.json();
    const student = JSON.parse(JSON.stringify(myJson))['0'];
    if (typeof student === 'undefined') {
      localStorage.clear();
    } else {
      if(student.admin === 1) {
        this.setState({gotoadmin: true});
      } else {
        this.setState({gotostudent: true});
      }
    }
  }
  
  logInUser = async () => {
    const stringName = document.getElementById('liusername').value;
    const response = await fetch(serverfuncs.apiURL + '/users/' + stringName);
    const myJson = await response.json();
    const student = JSON.parse(JSON.stringify(myJson))['0'];
    if (typeof student === 'undefined') {
      alert("Username or password are incorrect. Please try again with correct credentials.")
    }
    else if(student.hash !== MD5(document.getElementById('lipassword').value)) {
      console.log(student.hash);
      console.log(MD5(document.getElementById('lipassword').value));
      alert("Username or password are incorrect. Please try again with correct credentials.")
    } else {
      console.log('login successful');
      localStorage.setItem('username', document.getElementById('liusername').value);
      localStorage.setItem('admin', student.admin);
      if (student.admin === 1) {
        this.setState({gotoadmin: true});
      } else {
        console.log('changing state');
        this.setState({gotostudent: true});
      }
    }
  }

  redirectToPage() {
    if (this.state.gotoadmin) {
      return <Redirect to='/admin' />
    }
    else {
      return <Redirect to='/gallery' />
    }
  }

  render(){
    return (
      <div> { this.state.gotoadmin || this.state.gotostudent ? (<div>{this.redirectToPage()}</div>)
          : (<div className="Login">
            <Appbar />
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Paper style={{width: 300, marginTop: 30}}>
                <h1 style={{textAlign: "center", color: "black", marginTop: 20}}>Login</h1>
                <div style={{alignItems: "center", textAlign: "center"}}>
                  {/* <form onSubmit={this.handleSubmit}>
                    <label>
                      Essay:
                      <textarea value={this.state.value} onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
                  </form> */}
                  <div>
                    <TextField
                      id="liusername"
                      label="Username"
                      margin="normal"
                      variant="outlined"
                      value={this.state.username}
                      onChange={(this.handleChange)}
                    />
                  </div>
                  <div>
                    <TextField
                      id="lipassword"
                      label="Password"
                      margin="normal"
                      variant="outlined"
                      type="password"
                      value={this.state.password}
                      onChange={this.handleChange}
                    />
                  </div>
                  <Button variant="contained" 
                  color="primary"
                  style={{marginTop: 10, marginBottom: 20, backgroundColor: "#002f86"}}
                  onClick={() => (this.logInUser())}>Log In
                  </Button>
                  {/* username:<input type = 'text' id = 'liusername'></input>
                  <p></p>password:<input type = 'text' id = 'lipassword'></input>
                  <p></p><button onClick = {serverfuncs.logInUser}>log in</button>
                  <p></p><button onClick = {serverfuncs.logOutUser}>log out</button> */}
                </div>
                </Paper>
              </View>
        </div>)}
      </div>
    );
   }
}
