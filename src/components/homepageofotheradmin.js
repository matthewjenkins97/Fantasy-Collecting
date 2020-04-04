import React, {Component} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import './gallerydropdown.css';
import * as serverfuncs from '../serverfuncs';

let tileData = [];

function openUserMenu() {
  document.getElementById('galleryview').style.left = '0px';
  document.getElementById('gallerybutton').style.left = '210px';
}

function closeUserMenu() {
  document.getElementById('galleryview').style.left = '-200px';
  document.getElementById('gallerybutton').style.left = '10px';
}

function raiseOtherGallery() {
  document.getElementById('gallerydropdown').style.top = '-600px';
}

class OtherGallery extends Component {
  constructor(props) {
    super(props);
    tileData = [];
  }

  async getBlurb(user) {
    let userInfo = await serverfuncs.getUser(user);
    userInfo = userInfo[0];
    // console.log(userInfo.blurb)
    document.getElementById('othergalleryblurb').innerHTML = userInfo.blurb;
  }

  async expandUsers(ref) {
    const userList = await serverfuncs.getAllUsers();
    for (const user in userList) {
      if (userList[user].username === localStorage.getItem('username') || userList[user].admin === 1) {
        continue;
      }
      try {
      document.getElementById('user_gt'+user.toString()).remove();
      } catch {}
      const buttonnode = document.createElement('a');
      buttonnode.id = 'user_gt'+user.toString();
      buttonnode.style.padding = '0px 0px 5px 0px';
      buttonnode.innerHTML = userList[user].username;
      buttonnode.onclick = function() {
        ref.getTileData(this.innerHTML);
        closeUserMenu();
        document.getElementById('gallerydropdown').style.top = '50px';
      };
      document.getElementById('galleryusers').appendChild(buttonnode);
    }
    document.getElementById('galleryusers').style.height = '100px';
  }

  async getTileData(user) {
    tileData = [];
    const artworks = await serverfuncs.getAllArtworks();
    for (const i in artworks) {
      if (artworks[i].owner == user) {
        tileData.push({
          img: artworks[i].url,
          identifier: artworks[i].identifier,
          title: artworks[i].title,
          artist: artworks[i].artist,
          year: artworks[i].year,
        });
      }
    }
    this.getBlurb(user);
    this.forceUpdate();
    document.getElementById('subgalleryname').innerHTML = user+'\'s Gallery';
  }

  render() {
    return (
      <div>
        <div>
          <div id='galleryview' class='sidebarinit'>
            <a class='closebtn' onClick={closeUserMenu}>&times;</a>
            <button class='dropbtn'>Users</button>
            <div id = 'galleryusers' class='dropdown-content'></div>
          </div>
          <a id = 'gallerybutton' class = 'galleryButtonAdmin' onClick = {() => {
            openUserMenu(); this.expandUsers(this);
          }}>View Galleries</a>
        </div>
        <div id = 'gallerydropdown' class = 'galleryDropdownAdmin'>
          <a class='closebtn' onClick={raiseOtherGallery}>&times;</a>
          <Typography id = 'subgalleryname' fontFamily='roboto' variant='h4' component='h4' style={{
            textAlign: 'center',
            paddingTop: 20,
            paddingBottom: 10}}>My Gallery</Typography>
          <div>
            <Grid
              container
              direction='row'
              justify='center'
              alignItems='left-justified'
            >
              {tileData.map((tile) => (
                <div style={{padding: 10}}>
                  <img src={tile.img} alt={tile.title} height={500}/>
                  <Paper style={{padding: 10}}>
                  <div>
                    <Typography variant='h6' fontFamily='roboto'>{tile.title}</Typography>
                    <Typography variant='subtitle1' fontFamily='roboto'>{tile.artist}, {tile.year}</Typography>
                  </div>
                  </Paper>
                </div>
              ))}
            </Grid>
            <div style={{padding: 10}}>
              <Typography fontFamily='roboto' variant='h4' component='h4' style={{
                textAlign: 'center',
                paddingTop: 20,
                paddingBottom: 10}}>Gallery Announcements</Typography>
              <h1 style={{textAlign: 'center'}} id='othergalleryblurb'></h1>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default OtherGallery;
