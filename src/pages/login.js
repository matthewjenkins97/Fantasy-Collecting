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
<<<<<<< HEAD
                <h1>Login</h1>
                username:<input type = 'text' id = 'username'></input>
                <p></p>password:<input type = 'text' id = 'password'></input>
                <p></p><button onClick = {serverfuncs.logInUser}>log in</button>
                <p></p><button onClick = {serverfuncs.logOutUser}>log out</button>
=======
                <div style={{ justifyContent: 'center', alignSelf: 'center'}}>
                    <h1>Login</h1>
                    <p textAlign='center'>username:<input type = 'text' id = 'title'></input></p>
                    <p textAlign='center'>password:<input type = 'text' id = 'title'></input></p>
                    <button>LOG IN</button>
                    <p>Don't have a password? <a href="google.com">Create one here</a> </p>
                </div>
>>>>>>> 26b3d958049ba1417ae7611e57e59a0ea9303e47
            </div>
        )
    
}

export default Login