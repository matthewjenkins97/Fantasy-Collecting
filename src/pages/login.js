import React from "react";
import ReactDOM from "react-dom";
//import Login from "../components/login";
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";
import * as serverfuncs from "../serverfuncs";

console.log(window.location);
if (localStorage.getItem('username') !== null && window.location.pathname == '/login') {
    serverfuncs.logBackInUser();
}
const Login = () => {
        return(
            <div>
                <h1>Login</h1>
                username:<input type = 'text' id = 'username'></input>
                <p></p>password:<input type = 'text' id = 'password'></input>
                <p></p><button onClick = {serverfuncs.logInUser}>log in</button>
                <p></p><button onClick = {serverfuncs.logOutUser}>log out</button>
            </div>
        )
    
}

export default Login