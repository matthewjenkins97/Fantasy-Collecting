import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
//import AppBar from './appbar';
import Typography from '@material-ui/core/Typography';
//import GridListTileBar from '@material-ui/core/GridListTileBar';
import Paper from '@material-ui/core/Paper'; 
import Popper from './popper';
//import Table from './table';
//import tileData from './tiledata';
import TradeWindow from './tradewindow'
import OtherGallery from './homepageofother'
import { getAllArtworks } from '../serverfuncs';
import { artworkImages } from './tiledata';

var tileData = [];


class Main extends Component  {

  constructor(props){
    super(props);
    tileData = [];
    this.getTileData();
    document.body.className = "gallery";
  }

  // addTradeWindow(thisclass) {
  //   addTrade = true;
  //   thisclass.forceUpdate();
  // }
  async getTileData() {
    const artworks = await getAllArtworks();
    console.log(artworks);
    for(var i in artworks) {
      if(artworks[i].owner == localStorage.getItem('username')) {
        tileData.push({
            img: require("../static/"+artworks[i].url),
            identifier: artworks[i].identifier,
            title: artworks[i].title,
            artist: artworks[i].artist,
            year: artworks[i].year,
          });
      }
    }
    console.log("got artworks")
    this.forceUpdate();
  }

  render() {
    return(
      <div>
        {/* <PinGrid /> */}
        {/* <GridList /> */}
        <div><OtherGallery/></div>
        <div><TradeWindow></TradeWindow></div>
        <Typography fontFamily="roboto" variant="h4" component="h4" style={{ 
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
                  <Typography variant="subtitle1" fontFamily="roboto">Artist: {tile.artist}</Typography>
                  <Typography variant="subtitle1" fontFamily="roboto">Year: {tile.year}</Typography>
                  <Button><Typography variant="subtitle2" fontFamily="roboto">History</Typography></Button>
                  <Button><Typography variant="subtitle2" fontFamily="roboto">Microresearch</Typography></Button>
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
      
    )
  }
}

export default Main