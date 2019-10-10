import React, { Component } from 'react';
import Homepage from './components/homepage';
import AppBar from './components/appbar';
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

class Home extends Component  {

  constructor(props){
    super(props);
  }

  render() {
    return(
    <div>
      <AppBar />
      <Router>
        <Switch>
          <Route exact path="/"  component={MainPage} />
          <Route exact path="/table" component={Table} />
          <Route exact path="/404notfound" component={ErrorPage}/>
          <Redirect to="/404notfound"/>
        </Switch>
      </Router>
    </div>
    )
  }
}

export default Home