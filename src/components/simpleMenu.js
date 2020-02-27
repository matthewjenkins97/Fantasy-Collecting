import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {Link} from 'react-router-dom';
import * as serverfuncs from '../serverfuncs';

export default function SimpleMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton edge='start' color='inherit' aria-label='menu'
        aria-controls='simple-menu' aria-haspopup='true' onClick={handleClick}>
        <MenuIcon />
      </IconButton>
      <Menu
        id='simple-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {props.mode ?
        (<Link to='/auction' style={{color: '#000000', textDecoration: 'none'}}><MenuItem onClick={() => {
          handleClose();
          serverfuncs.cancelTrade();
        }}>Auction</MenuItem></Link>) :
        (<Link to='/gallery' style={{color: '#000000', textDecoration: 'none'}}><MenuItem onClick={() => {
          handleClose();
          serverfuncs.cancelTrade();
        }}>
        My Gallery</MenuItem></Link>)}
        <Link to='/' style={{color: '#000000', textDecoration: 'none'}}><MenuItem onClick={() => {
          serverfuncs.logOutUser();
        }}>Log Out</MenuItem></Link>
      </Menu>
    </div>
  );
}
