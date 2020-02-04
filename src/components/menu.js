import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '../static/menuIcon.png';
import './backgroundlogin.css';
var anchorEl;
var setAnchorEl; 

export default class SimpleMenu extends React.Component {
  constructor(props) {
    super(props);
    [anchorEl, setAnchorEl]= React.useState(null);
    document.body.className = "background";
  }
  

  handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  handleClose() {
    setAnchorEl(null);
  }

  render() {
      return (
      <div>
        <Button aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick}>
          <img src={MenuIcon} />
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem onClick={this.handleClose}>Profile</MenuItem>
          <MenuItem onClick={this.handleClose}>View all users</MenuItem>
          <MenuItem onClick={this.handleClose}>Auction</MenuItem>
        </Menu>
      </div>
    );
  }
}