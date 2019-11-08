import React from "react";
import ReactDOM from "react-dom";
import Login from "../components/login";
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";
import * as serverfuncs from "../serverfuncs";
import Background from '../static/loginpage.jpg';

console.log(window.location);
if (localStorage.getItem('username') !== null && window.location.pathname == '/login') {
    serverfuncs.logBackInUser();
}
const LoginPage = () => {
        return(
            <div>
                <Login />
                <Background />
                {/* <h1>Login</h1>
                username:<input type = 'text' id = 'liusername'></input>
                <p></p>password:<input type = 'text' id = 'lipassword'></input>
                <p></p><button onClick = {serverfuncs.logInUser}>log in</button>
                <p></p><button onClick = {serverfuncs.logOutUser}>log out</button> */}
            </div>
        )
    
}

export default Login