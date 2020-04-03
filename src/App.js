import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

// Pages
import MainPage from './pages/index';
import Table from './pages/usertable';
import ErrorPage from './pages/error';
import Login from './pages/login';
import Auction from './pages/auction';
import ArtTable from './pages/arttable';
import TradeOption from './pages/tradeoption';
import AdminPage from './pages/admin';
import TradeTable from './pages/tradetable';
import AdminAuction from './pages/adminauction';
import AdminForm from './pages/adminform';
import SinglePage from './pages/singleartwork';

const PrivateRoute = ({component: Component, ...rest}) => (
  <Route {...rest} render={(props) => (
    (localStorage.getItem('username') !== null) ?
    <Component {...props} /> :
    <Redirect to='/' />
  )} />
);

const AdminRoute = ({component: Component, ...rest}) => (
  <Route {...rest} render={(props) => (
    ((localStorage.getItem('username') !== null) &&
    (localStorage.getItem('admin') === '1')) ?
    <Component {...props} /> :
    <Redirect to='/gallery' />
  )} />
);

class Home extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div>
          <Router>
            <Switch>
              <Route exact path='/' component={Login} />
              <PrivateRoute path='/tradeoption' component={TradeOption}/>
              <AdminRoute path='/table' component={Table} />
              <AdminRoute path='/arttable' component={ArtTable} />
              <AdminRoute path='/tradetable' component={TradeTable}/>
              <AdminRoute path='/adminauction' component={AdminAuction}/>
              <PrivateRoute path='/gallery' component={MainPage} />
              <PrivateRoute path='/auction' component={Auction} />
              {/* <PrivateRoute path='/form' component={FormPage} /> */}
              <PrivateRoute path='/adminform' component={AdminForm} />
              <PrivateRoute path='/singleartwork' component={SinglePage} />
              <AdminRoute path='/admin' component={AdminPage}/>
              <Route exact path='/404notfound' component={ErrorPage}/>
              <Redirect to='/404notfound'/>
            </Switch>
          </Router>
        </div>
      </div>
    );
  }
}

export default Home;
