import React from 'react';
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
  },
  {
    img: '../static/dance.jpg',
    title: "Dance",
    artist: 'Matisse',
  },
  {
    img: '../static/sunflowers.jpg',
    title: "Sunflowers",
    artist: 'Van Gogh',
  },
];

const Home = () => (
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
            <img src={tile.img} alt={tile.title} height={500}/>
            <Typography variant="h6" fontFamily="roboto">{tile.title}</Typography>
            <Typography variant="h7" fontFamily="roboto">By: {tile.artist}</Typography>
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
  </div>
)

export default Home