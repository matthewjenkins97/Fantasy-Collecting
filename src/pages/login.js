import React from "react";
import ReactDOM from "react-dom";
//import Login from "../components/login";
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";

const Login = () => {
        return(
            <div>
                <div style={{ justifyContent: 'center', alignSelf: 'center'}}>
                    <h1>Login</h1>
                    <p textAlign='center'>username:<input type = 'text' id = 'title'></input></p>
                    <p textAlign='center'>password:<input type = 'text' id = 'title'></input></p>
                    <button>LOG IN</button>
                    <p>Don't have a password? <a href="google.com">Create one here</a> </p>
                </div>
            </div>
        )
    
}

export default Login