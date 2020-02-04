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
import Table from "./pages/usertable";
import ErrorPage from "./pages/error";
import Login from "./pages/login";
import Auction from "./pages/auction";
import ArtTable from './pages/arttable';
import TradeOption from './pages/tradeoption';
import AdminPage from './pages/admin';
import TradeTable from './pages/tradetable';
import AdminAuction from './pages/adminauction';
import FormPage from './pages/form';
import AdminForm from './pages/adminform';

import { default as Chatkit } from '@pusher/chatkit-server';

//serverfuncs.isAdmin(localStorage.getItem('username'))) === true
// const chatkit = new Chatkit({
//   instanceLocator: "v1:us1:f04ab5ec-b8fc-49ca-bcfb-c15063c21da8",
//   key: "32b71a31-bcc2-4750-9cff-59640b74814e:hQq+MMcoDqpXgMK0aPNPcm8uFHFDRmNDWcYNeiP2Zjg="
// })

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    (localStorage.getItem('username') !== null)
    ? <Component {...props} />
    : <Redirect to='/' />
  )} />
)

const AdminRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    ((localStorage.getItem('username') !== null) &&
    (localStorage.getItem('admin') === '1'))
    ? <Component {...props} />
    : <Redirect to='/gallery' />
  )} />
)

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
              <Route exact path="/"  component={Login} /> 
              <PrivateRoute path="/tradeoption" component={TradeOption}/> 
               <AdminRoute path="/table" component={Table} />
              <AdminRoute path="/arttable" component={ArtTable} />
              <AdminRoute path="/tradetable" component={TradeTable}/>
              <AdminRoute path="/adminauction" component={AdminAuction}/> 
              <PrivateRoute path="/gallery" component={MainPage} />
              <PrivateRoute path="/auction" component={Auction} />
              {/* <PrivateRoute path="/form" component={FormPage} /> */}
              <PrivateRoute path="/adminform" component={AdminForm} />
              <AdminRoute path="/admin" component={AdminPage}/> 
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