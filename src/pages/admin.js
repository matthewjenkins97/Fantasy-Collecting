import React from "react";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ChatComponent from "../components/ChatMessage";
import Paper from '@material-ui/core/Paper';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';
import { View } from 'react-native';
import * as serverfuncs from '../serverfuncs.js';
import { NavLink } from 'react-router-dom'

function checkConfirmation() {
  if (window.confirm("WARNING: Resetting the game means removing all non-admin users, all artwork metadata (including history, microresearch, and theoretical price data), and all archived trade details. Press OK if you want to continue.")) {
    if (window.confirm("WARNING: THIS CANNOT BE UNDONE. Press OK if you are 100% certain you want to reset the game.")) {
      serverfuncs.resetGame();
    }
  }
}

function SimpleMenu() {
    document.body.className = "background";
    const [anchorEl, setAnchorEl] = React.useState(null);
  
    const handleClick = event => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    return (
      <div>
          <IconButton edge="start" color="inherit" aria-label="menu"
          aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                <MenuIcon />
            </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <Link to="/" style={{color: "#000000", textDecoration: "none"}}><MenuItem onClick={() => (serverfuncs.logOutUser())}>Log Out</MenuItem></Link>
        </Menu>
      </div>
    );
  }

const AdminPage = () => {
          return(
            <div>
                <AppBar position="static" style={{backgroundColor: "#002f86"}}>
                    <Toolbar variant="dense">
                        {SimpleMenu()}
                        <Typography variant="h6" color="inherit">
                            Fantasy Collecting -&nbsp;
                        </Typography>
                        <Typography variant="h6" color="inherit">
                          {localStorage.getItem('username')}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <br />
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Paper style={{width: 500, marginTop: 30, padding: 20}}>
                  <Typography variant="h3"  align="center">Hello, Professor!</Typography>
                  <br />
                    <View style={{paddingLeft: '10%', paddingRight: '10%', flexDirection: 'column', alignItems: 'center'}}>
                    <Link style={{color: '#ffffff', textDecoration: 'none', justifyContent: 'center'}} to="/table">
                        <Button variant="contained" 
                          color="primary"
                          style={{marginTop: 10, marginBottom: 20, width: 400, backgroundColor: "#002f86"}}
                          ><span style={{fontSize: '1.5em'}}>Users</span>
                        </Button>
                        </Link>
                        <Link style={{color: '#ffffff', textDecoration: 'none'}} to="/arttable">
                        <Button variant="contained" 
                          color="primary"
                          style={{marginTop: 10, marginBottom: 20, width: 400, backgroundColor: "#002f86"}}
                          ><span style={{fontSize: '1.5em'}}>Artworks</span>
                        </Button>
                        </Link>
                        <Link style={{color: '#ffffff', textDecoration: 'none'}} to="/tradetable">
                        <Button variant="contained" 
                          color="primary"
                          style={{marginTop: 10, marginBottom: 20, width: 400, backgroundColor: "#002f86"}}
                          ><span style={{fontSize: '1.5em'}}>Incoming Trades</span>
                        </Button>
                        </Link>
                        <Link style={{color: '#ffffff', textDecoration: 'none'}} to="/adminauction">
                        <Button variant="contained" 
                          color="primary"
                          style={{marginTop: 10, marginBottom: 20, width: 400, backgroundColor: "#002f86"}}><span style={{fontSize: '1.5em'}}>Create Auction</span>
                        </Button>
                        </Link>
                        <Button variant="contained" 
                          color="primary"
                          onClick={checkConfirmation}
                          style={{marginTop: 10, marginBottom: 20, width: 400, backgroundColor: "#002f86"}}><span style={{fontSize: '1.5em'}}
                          >Reset Game</span>
                      </Button>
                  </View>
                </Paper>
                </View>
                <div><ChatComponent /></div>
            </div>
        )
}

export default AdminPage