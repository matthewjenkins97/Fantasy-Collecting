import React from "react";
import Table from "../components/tradetable";
import ChatComponent from "../components/ChatMessage";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ArtTable from "../components/artworktable";
import { Link } from "react-router-dom";
import * as serverfuncs from '../serverfuncs';
import IncomingTrades from '../components/incomingtrades'

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
          <MenuItem onClick={handleClose}><Link to="/admin" style={{color: "#000000", textDecoration: "none"}}>Admin Homepage</Link></MenuItem>
          <MenuItem onClick={handleClose}><Link to="/table" style={{color: "#000000", textDecoration: "none"}}>Users</Link></MenuItem>
          <MenuItem onClick={handleClose}><Link to="/arttable" style={{color: "#000000", textDecoration: "none"}}>Artworks</Link></MenuItem>
          <MenuItem onClick={handleClose}><Link to="/adminauction" style={{color: "#000000", textDecoration: "none"}}>Auction</Link></MenuItem>
          <MenuItem onClick={() => (serverfuncs.logOutUser())}><Link to="/" style={{color: "#000000", textDecoration: "none"}}>Log Out</Link></MenuItem>
        </Menu>
      </div>
    );
  }

const TablePage = () => {
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
                {/* <Table /> */}
                <IncomingTrades/>
            </div>
        )
    
}

export default TablePage