import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import SimpleMenu from '../components/menu';
import ChatComponent from './ChatMessage';
import Coin from '../static/coin.png';
//import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
}));


export default function DenseAppBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      
      <AppBar position="static" >
        <Toolbar variant="dense">
          <SimpleMenu />
          <Typography variant="h6" color="inherit">
            Fantasy Collecting
          </Typography>
            <img src={Coin} style={{marginLeft: 800}}/>
            <Typography variant="subtitle1" color="inherit" style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
              $1,000
            </Typography>
        </Toolbar>
      </AppBar>
      <ChatComponent />
    </div>
  );
}