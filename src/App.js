import React, { Component } from 'react';
import Homepage from './components/homepage';
import AppBar from './components/appbar';
import * as serverfuncs from './serverfuncs';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

//Pages
import MainPage from "./pages/index";
import Table from "./pages/table";
import ErrorPage from "./pages/error";
import Login from "./pages/login";


class Home extends Component  {

  constructor(props){
    super(props);
  }

  render() {
    return(
      <div>
        {/*<div>
        <p></p>username:<input type = 'text' id = 'username'></input>
        <p></p>password:<input type = 'text' id = 'password'></input>
        <p></p>name:<input type = 'text' id = 'name'></input>
        <p></p>admin:<input type = 'checkbox' id = 'admin'></input>
        <p></p>guilders:<input type = 'number' id = 'guilders'></input>
        <p></p>micro:<input type = 'number' id = 'micropoints'></input>
        <p></p>paintings:<input type = 'text' id = 'paintings'></input>
        </div>
        <button onClick = {serverfuncs.createUser}>CREATE ACCOUNT</button>
        <button onClick = {serverfuncs.logInUser}>LOG IN</button>
        <button onClick = {serverfuncs.logOutUser}>LOG OUT</button>
        <p id = 'mytext'>NULL</p>
        <div>
          <button onClick = {serverfuncs.createArtPost}>CREATE ART POST</button>
        </div>
        <div>
          <p></p>title:<input type = 'text' id = 'title'></input>
          <p></p>artist:<input type = 'text' id = 'artist'></input>
          <p></p>year:<input type = 'text' id = 'year'></input>
          <p></p>theoretical:<input type = 'number' id = 'theoretical'></input>
          <p></p>actual:<input type = 'number' id = 'actual'></input>
          <p></p>hidden:<input type = 'checkbox' id = 'hidden'></input>
          <p></p>owner:<input type = 'text' id = 'owner'></input>
          <p></p>url:<input type = 'text' id = 'url'></input>
        </div>*/}
        {/* <AppBar />
        {/* <PinGrid /> */}
        {/* <GridList /> */}
        <div>
          <Router>
            <Switch>
              <Route exact path="/"  component={MainPage} />
              <Route exact path="/table" component={Table} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/404notfound" component={ErrorPage}/>
              <Redirect to="/404notfound"/>
            </Switch>
          </Router>
        </div>
      </div>
      
    )
  }
}

export default Home