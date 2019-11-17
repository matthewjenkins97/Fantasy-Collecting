import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
//import AppBar from './appbar';
import Typography from '@material-ui/core/Typography';
//import GridListTileBar from '@material-ui/core/GridListTileBar';
import Paper from '@material-ui/core/Paper'; 
import Popper from './popper';
//import Table from './table';
//import tileData from './tiledata';
import { getAllArtworks } from '../serverfuncs';
import { artworkImages } from './tiledata';
import './gallerydropdown.css';
import * as serverfuncs from '../serverfuncs'

var tileData = [];

function openUserMenu() {
  document.getElementById("galleryview").style.left = "0px";
  document.getElementById("gallerybutton").style.left = "210px";
}

function closeUserMenu() {
  document.getElementById("galleryview").style.left = "-200px";
  document.getElementById("gallerybutton").style.left = "10px";
}

function raiseOtherGallery() {
  document.getElementById("gallerydropdown").style.top = "-600px";
}

class OtherGallery extends Component  {

  constructor(props){
    super(props);
    tileData = [];
    //document.body.className = "gallery";
  }

  async expandUsers(ref) {
    var userList = await serverfuncs.getAllUsers();
    for(var user in userList) {
      try {
        document.getElementById("user_gt"+user.toString()).remove();
      } catch { }
      var buttonnode = document.createElement("a");
      buttonnode.id = "user_gt"+user.toString();
      buttonnode.innerHTML = userList[user].username;
      buttonnode.onclick = function() { 
        ref.getTileData(this.innerHTML);
        closeUserMenu();
        document.getElementById("gallerydropdown").style.top = "0px";
      }
      document.getElementById("galleryusers").appendChild(buttonnode);
    }
    document.getElementById("galleryusers").style.height = "100px";
  }
  async getTileData(user) {
    tileData = [];
    const artworks = await getAllArtworks();
    for(var i in artworks) {
      if(artworks[i].owner == user) {
        tileData.push({
            img: require("../static/"+artworks[i].url),
            title: artworks[i].title,
            artist: artworks[i].artist,
            description: "NOT IN DB YET",
          });
      }
    }
    this.forceUpdate();
    document.getElementById("subgalleryname").innerHTML = user+"'s Gallery";
  }

  render() {
    return(
      <div>
        <div>
          <div id="galleryview" class="sidebarinit">
            <a class="closebtn" onClick={closeUserMenu}>&times;</a>

            <button class="dropbtn">Users</button>

            <div id = "galleryusers" class="dropdown-content"></div>
          </div>
          <a id = "gallerybutton" class = "galleryButton" onClick = {() => {openUserMenu(); this.expandUsers(this);}}>view galleries</a>
        </div>
        <div id = "gallerydropdown" class = "galleryDropdown">
            <a class="closebtn" onClick={raiseOtherGallery}>&times;</a>
          {/* <PinGrid /> */}
          {/* <GridList /> */}
          <Typography id = "subgalleryname" fontFamily="roboto" variant="h4" component="h4" style={{ 
            textAlign: 'center',
            paddingTop: 20,
            paddingBottom: 10}}>My Gallery</Typography>
          <div>
            <Grid
            container
            direction="row"
            justify="center"
            alignItems="left-justified"
            >
              {tileData.map(tile => (
                <div style={{padding: 10}}>
                  
                  <img src={tile.img} alt={tile.title} height={500}/>
                  <Paper style={{ padding: 10 }}>
                    <Typography variant="h6" fontFamily="roboto">{tile.title}</Typography>
                    <Typography variant="subtitle1" fontFamily="roboto">By: {tile.artist}</Typography>
                  <div style={{paddingTop: 5, position: 'relative', alignSelf: 'right', justifyContent: 'flex-end'}}>
                    <Popper text={tile.description} />
                  </div>
                  </Paper>
                  {/* <GridListTileBar
                    title={tile.title}
                    subtitle={<span>by: {tile.artist}</span>}
                  /> */}
                </div>
              ))}  
                {/* <div style={{padding: 10}}><img src="./static/monalisa.jpg" height={500}/>
                </div>
                <div style={{padding: 10}}><img src="./static/dance.jpg" height={500} /></div>
                <div style={{padding: 10}}><img src="./static/sunflowers.jpg" height={500}/></div> */}
            </Grid>
          </div>
        </div>
      </div>
      
    )
  }
}

export default OtherGallery