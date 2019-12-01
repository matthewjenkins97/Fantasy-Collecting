import React from "react";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';
import { View } from 'react-native';
import * as serverfuncs from '../serverfuncs.js';

function SimpleMenu() {
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
          <MenuItem onClick={() => (serverfuncs.logOutUser())}><Link to="/" style={{color: "#000000", textDecoration: "none"}}>Log Out</Link></MenuItem>
        </Menu>
      </div>
    );
  }

const AdminPage = () => {
          return(
            <div>
                <AppBar position="static">
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
                <Typography variant="h2" style={{color: "#ffffff"}} align="center">Hello, Professor!</Typography>
                <br />
                <View style={{paddingLeft: '40%', paddingRight: '40%', flexDirection: 'column', justifyContent: 'center'}}>
                    <Button variant="contained" 
                      color="primary"
                      style={{marginTop: 10, marginBottom: 20}}
                      ><Link style={{color: '#ffffff', textDecoration: 'none'}} to="/table">Users</Link>
                    </Button>
                    <Button variant="contained" 
                      color="primary"
                      style={{marginTop: 10, marginBottom: 20}}
                      ><Link style={{color: '#ffffff', textDecoration: 'none'}} to="/arttable">Artworks</Link>
                    </Button>
                    <Button variant="contained" 
                      color="primary"
                      style={{marginTop: 10, marginBottom: 20}}
                      ><Link style={{color: '#ffffff', textDecoration: 'none'}} to="/tradetable">Incoming Trades</Link>
                    </Button>
                    <Button variant="contained" 
                      color="primary"
                      style={{marginTop: 10, marginBottom: 20}}><Link style={{color: '#ffffff', textDecoration: 'none'}} to="/adminauction">Create Auction</Link>
                    </Button>
                </View>
            </div>
        )
}

export default AdminPage