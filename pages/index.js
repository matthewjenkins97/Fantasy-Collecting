import React, { Component } from 'react';
// import Link from 'next/link';
// import Head from 'next/head';
// import Nav from '../components/nav';
// import SimpleMenu from '../components/menu';
import Grid from '@material-ui/core/Grid';
// import MediaCard from '../components/card';
// import GridList from '../components/gridlist';
import AppBar from '../components/appbar';
import Typography from '@material-ui/core/typography';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Paper from '@material-ui/core/Paper'; 
import Popper from '../components/popper';
import Table from '../components/table';
// import PinGrid from '../components/pinterestgrid';
// import GridListTile from '@material-ui/core/GridListTile';
// import ListSubheader from '@material-ui/core/ListSubheader';
// import 'typeface-roboto';
//import MonaLisa from '../static/monalisa.jpg;

const tileData = [
  {
    img: '../static/monalisa.jpg',
    title: "Mona Lisa",
    artist: 'DaVinci',
    description: "The Mona Lisa is a half-length portrait painting by the Italian Renaissance artist Leonardo da Vinci that has been described as the best known, the most visited, the most written about, the most sung about, the most parodied work of art in the world.",
  },
  {
    img: '../static/dance.jpg',
    title: "Dance",
    artist: 'Matisse',
    description: "Dance is a painting made by Henri Matisse in 1910, at the request of Russian businessman and art collector Sergei Shchukin, who bequeathed the large decorative panel to the Hermitage Museum in Saint Petersburg, Russia.",
  },
  {
    img: '../static/sunflowers.jpg',
    title: "Sunflowers",
    artist: 'Van Gogh',
    description: "Sunflowers is the name of two series of still life paintings by the Dutch painter Vincent van Gogh. The first series, executed in Paris in 1887, depicts the flowers lying on the ground, while the second set, executed a year later in Arles, shows a bouquet of sunflowers in a vase. ",
  },
];



class Home extends Component  {

  constructor(props){
    super(props);
    this.state = { showPopup: false };
  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
  }

  render() {
    return(
      <div>
        <AppBar />
        {/* <PinGrid /> */}
        {/* <GridList /> */}
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
                <img src={tile.img} alt={tile.title} height={500} onClick={this.togglePopup.bind(this)}/>
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
              {/* <div style={{padding: 10}}><img src="../static/monalisa.jpg" height={500}/>
              </div>
              <div style={{padding: 10}}><img src="../static/dance.jpg" height={500} /></div>
              <div style={{padding: 10}}><img src="../static/sunflowers.jpg" height={500}/></div> */}
          </Grid>
        </div>
        <Table />
      </div>
      
    )
  }
}

export default Home