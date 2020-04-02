import React, {Component} from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TradeWindow from './tradewindow';
import OtherGallery from './homepageofother';
import {getAllArtworks, setBlurb, getUser} from '../serverfuncs';
import ChatComponent from '../components/ChatMessage';
import HistoryTable from '../components/historytable';
import './gallerydropdown.css';
import MicroresearchPrompt from '../components/microresearchprompt.js';
import MicroresearchTable from '../components/microresearchtable.js';
import Form from './form';
import './ratings.css';

let tileData = [];

class Single extends Component {
  constructor(props) {
    super(props);
    tileData = [];
    this.getTileData();
    this.getBlurb();
    document.body.className = 'gallery';
  }

  // addTradeWindow(thisclass) {
  //   addTrade = true;
  //   thisclass.forceUpdate();
  // }
  async getTileData() {
    const artworks = await getAllArtworks();
    // console.log(artworks);
    for (const i in artworks) {
      if (artworks[i].owner === localStorage.getItem('username') && artworks[i].hidden !== 1) {
        tileData.push({
          img: artworks[i].url,
          identifier: artworks[i].identifier,
          title: artworks[i].title,
          artist: artworks[i].artist,
          year: artworks[i].year,
          theoreticalprice: artworks[i].theoreticalprice,
          actualprice: artworks[i].actualprice,
        });
      }
    }
    // console.log('got artworks')
    this.forceUpdate();
  }

  async getBlurb() {
    const user = localStorage.getItem('username');
    let userInfo = await getUser(user);
    userInfo = userInfo[0];
    document.getElementById('galleryblurb').value = userInfo.blurb;
  }

  saveBlurb() {
    const username = localStorage.getItem('username');
    const blurb = document.getElementById('galleryblurb').value;
    setBlurb(username, blurb);
  }

  openForm() {
    document.getElementById('ratingpage').style.left = '0%';
  }

  render() {
    return (
      <div>
        <div>
          <div><ChatComponent /></div>
          <div><OtherGallery/></div>
          <div><TradeWindow></TradeWindow></div>
        </div>
        <Typography fontFamily='roboto' variant='h4' component='h4' style={{
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
                <img src={tile.img} alt={tile.title} style={{leftMargin: 'auto', rightMargin: 'auto', display: 'block', height: 500}}/>
                <Paper style={{padding: 10}}>
                  <div>
                    <div style={{float: 'left',
                      width: '80%'}}>
                      <Typography variant='h6' fontFamily='roboto'>{tile.title}</Typography>
                      <Typography variant='subtitle1' fontFamily='roboto'>{tile.artist}, {tile.year}</Typography>
                    </div>
                    <div style={{float: 'right',
                      width: '20%',
                      textAlign: 'right'}}>
                      <Typography variant='h4' fontFamily='roboto'>{tile.actualprice !== 0 && tile.actualprice !== undefined ? tile.actualprice : tile.theoreticalprice}</Typography>
                    </div>
                  </div>
                  <div style={{marginTop: '1in'}}>
                    <hr></hr>
                    <HistoryTable identifier={tile.identifier}/>
                    <MicroresearchTable identifier={tile.identifier}/>
                    <MicroresearchPrompt identifier={tile.identifier}/>
                  </div>
                </Paper>
                {/* <GridListTileBar
                  title={tile.title}
                  subtitle={<span>by: {tile.artist}</span>}
                /> */}
              </div>
            ))}
            {/* <div style={{padding: 10}}><img src='./static/monalisa.jpg' height={500}/>
              </div>
              <div style={{padding: 10}}><img src='./static/dance.jpg' height={500} /></div>
              <div style={{padding: 10}}><img src='./static/sunflowers.jpg' height={500}/></div> */}
          </Grid>
          <br />
          <Typography fontFamily='roboto' variant='h4' component='h4' style={{
            textAlign: 'center',
            paddingTop: 20,
            paddingBottom: 10}}>My Gallery Announcements</Typography>
          <div style={{textAlign: 'center'}}>
            <textarea style={{width: '50%', height: 100}} id='galleryblurb' multiline='true'></textarea>
          </div>
          <Button style={{margin: 'auto', display: 'block'}} onClick={this.saveBlurb}>Save</Button>
        </div>
        <button id = 'ratingbutton' onClick = {() => {
          this.openForm();
        }} className = 'openFormButton'>Rate Artworks</button>
        <div id = 'ratingpage' style = {{overflowX: 'hidden', color: 'white', zIndex: 10000, backgroundColor: 'rgba(0, 0, 0, .7)', position: 'absolute', top: '0px', width: '100%', left: '-100%', transition: '1s'}}>
          <Form/>
        </div>
      </div>
    );
  }
}

export default Single;
