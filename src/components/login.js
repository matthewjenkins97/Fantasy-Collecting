import React, { useState } from "react";
//import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import * as serverfuncs from '../serverfuncs';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

// @media all and (min-width: 480px) {
//   .Login {
//     padding: 60px 0;
//   }

//   .Login form {
//     margin: 0 auto;
//     max-width: 320px;
//   }
// }

class Login extends React.Component{
  constructor(props) {
    super(props);
    this.state = { values: {username: '', password: ''}};
    this.handleChange = this.handleChange.bind(this);
  };

  handleChange(event) {
    this.setState({username: event.target.username});
    this.setState({password: event.target.password});
  }

  render(){
    return (
      <div className="Login">
                <h1 style={{textAlign: "center"}}>Login</h1>
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
                  style={{marginTop: 10}}
                  onClick={serverfuncs.logInUser}>Log In
                  </Button>
                  {/* username:<input type = 'text' id = 'liusername'></input>
                  <p></p>password:<input type = 'text' id = 'lipassword'></input>
                  <p></p><button onClick = {serverfuncs.logInUser}>log in</button>
                  <p></p><button onClick = {serverfuncs.logOutUser}>log out</button> */}
                </div>
      </div>
    );
   }
}

export default Login