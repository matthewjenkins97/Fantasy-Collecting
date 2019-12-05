import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Link } from "react-router-dom";
import * as serverfuncs from '../serverfuncs';

export default function SimpleMenu(props) {
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

      {/* <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        Open Menu
      </Button> */}
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {props.mode ? 
           (<MenuItem onClick={() => {handleClose(); serverfuncs.cancelTrade();}}><Link to="/auction" style={{color: "#000000", textDecoration: "none"}}>Auction</Link></MenuItem>)
           : (<MenuItem onClick={() => {handleClose(); serverfuncs.cancelTrade();}}><Link to="/gallery" style={{color: "#000000", textDecoration: "none"}}>My Gallery</Link></MenuItem>) }
           <MenuItem onClick={() => (serverfuncs.logOutUser())}><Link to="/" style={{color: "#000000", textDecoration: "none"}}>Log Out</Link></MenuItem>
      </Menu>
    </div>
  );
}