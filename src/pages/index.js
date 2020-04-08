import React, {Component} from 'react';
import Homepage from '../components/homepage';
import SimpleMenu from '../components/simpleMenu';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import * as serverfuncs from '../serverfuncs';
import Grid from '@material-ui/core/Grid';
import Notification from '../components/notification';
import Guilder from '../static/guilder.svg';

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      guilders: 0,
    };
    this.getGuilders = this.getGuilders.bind(this);
    this.getGuilders();
  }

  async getGuilders() {
    const userlist = await serverfuncs.getUser(localStorage.getItem('username'));
    this.setState({
      guilders: userlist[0].guilders,
    });
    this.guilders = userlist[0].guilders;
    // console.log('GUILDERS IS IT HERE');
    // console.log(guilders)
  }

  render() {
    return (
      <div>
        <Notification/>
        <AppBar position='fixed' style={{backgroundColor: '#002f86'}}>
          <Toolbar variant='dense'>
            <Grid
              justify='space-between'
              container spacing={1}
            >
              <Grid item xs={'90%'}>
                <SimpleMenu mode={true}/>
              </Grid>
              <Grid item xs>
                <Typography variant='h6' color='inherit' style={{marginTop: 9}}>
                    Fantasy Collecting - {localStorage.getItem('username')}
                </Typography>
              </Grid>
              <Grid item xs>
                <Typography variant='h6' style={{float: 'right', marginTop: 10}}>
                  <img src={Guilder} height='20' width='20'></img>
                  {this.state.guilders}</Typography>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <br></br>
        <br></br>
        {/* <Button onClick={() => {console.log(typeof localStorage.getItem('admin'))}}>click</Button> */}
        <Homepage />
      </div>
    );
  }
}

export default MainPage;
