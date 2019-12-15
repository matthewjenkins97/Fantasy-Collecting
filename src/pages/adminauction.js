import React from "react";
import ReactDOM from "react-dom";
import AdminAuction from "../components/adminauction";
import Table from "../components/artworktable";
import AppBar from '@material-ui/core/AppBar';
import ChatComponent from "../components/ChatMessage";
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Link } from "react-router-dom";
import * as serverfuncs from "../serverfuncs";
import Notification from "../components/notification";

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
        <Notification/>
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
          {/* <MenuItem onClick={handleClose}><Link to="/gallery" style={{color: "#000000", textDecoration: "none"}}>My Gallery</Link></MenuItem> */}
          <Link to="/admin" style={{color: "#000000", textDecoration: "none"}}><MenuItem onClick={handleClose}>Admin Homepage</MenuItem></Link>
          <Link to="/table" style={{color: "#000000", textDecoration: "none"}}><MenuItem onClick={handleClose}>Users</MenuItem></Link>
          <Link to="/arttable" style={{color: "#000000", textDecoration: "none"}}><MenuItem onClick={handleClose}>Artworks</MenuItem></Link>
          <Link to="/tradetable" style={{color: "#000000", textDecoration: "none"}}><MenuItem onClick={handleClose}>Trades</MenuItem></Link>
          <Link to="/" style={{color: "#000000", textDecoration: "none"}}><MenuItem onClick={() => (serverfuncs.logOutUser())}>Log Out</MenuItem></Link>
        </Menu>
      </div>
    );
  }

const AuctionPage = () => {
    return(
        <div>
            <AppBar position="fixed" style = {{backgroundColor: "#002f86"}}>
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
                <br></br>
                <br></br>
                <ChatComponent />
            <AdminAuction style={{flex: 1, zIndex: 1}}/>
            {/* <h1>Login</h1>
            username:<input type = 'text' id = 'liusername'></input>
            <p></p>password:<input type = 'text' id = 'lipassword'></input>
            <p></p><button onClick = {serverfuncs.logInUser}>log in</button>
            <p></p><button onClick = {serverfuncs.logOutUser}>log out</button> */}
        </div>
    )

}

export default AuctionPage