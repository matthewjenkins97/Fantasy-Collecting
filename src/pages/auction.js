import React from "react";
import ReactDOM from "react-dom";
import Auction from "../components/auction";
import Table from "../components/artworktable";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Link } from "react-router-dom";
import * as serverfuncs from "../serverfuncs";

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
          <MenuItem onClick={handleClose}><Link to="/gallery" style={{color: "#000000", textDecoration: "none"}}>My Gallery</Link></MenuItem>
          <MenuItem onClick={handleClose}><Link to="/table" style={{color: "#000000", textDecoration: "none"}}>View All Users</Link></MenuItem>
          <MenuItem onClick={handleClose}><Link to="/arttable" style={{color: "#000000", textDecoration: "none"}}>Artworks</Link></MenuItem>
          <MenuItem onClick={() => (serverfuncs.logOutUser())}><Link to="/" style={{color: "#000000", textDecoration: "none"}}>Log Out</Link></MenuItem>
        </Menu>
      </div>
    );
  }

const AuctionPage = () => {
    return(
        <div>
            <AppBar position="static">
                    <Toolbar variant="dense">
                        {SimpleMenu()}
                        <Typography variant="h6" color="inherit">
                            Fantasy Collecting
                        </Typography>
                    </Toolbar>
                </AppBar>
            <Auction />
            {/* <h1>Login</h1>
            username:<input type = 'text' id = 'liusername'></input>
            <p></p>password:<input type = 'text' id = 'lipassword'></input>
            <p></p><button onClick = {serverfuncs.logInUser}>log in</button>
            <p></p><button onClick = {serverfuncs.logOutUser}>log out</button> */}
        </div>
    )

}

export default AuctionPage