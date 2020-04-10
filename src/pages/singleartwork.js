import React from 'react';
import Single from '../components/singleartwork';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Notification from '../components/notification';
import SimpleMenu from '../components/simpleMenu';
import Grid from '@material-ui/core/Grid';
import Guilder from '../static/guilder.svg';

const SinglePage = () => {
  return (
    <div>
      <Notification/>
      <AppBar position='fixed' style = {{backgroundColor: '#002f86'}}>
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
                {}</Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <Single/>
    </div>
  );
};

export default SinglePage;
