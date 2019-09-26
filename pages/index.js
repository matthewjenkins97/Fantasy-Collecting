import React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import Nav from '../components/nav'
import SimpleMenu from '../components/menu'
import Grid from '@material-ui/core/Grid';
import MediaCard from '../components/card';
import GridList from '../components/gridlist';
import AppBar from '../components/appbar';
//import MonaLisa from '../static/monalisa.jpg;


const Home = () => (
  // <Grid
  // container
  // direction="row"
  // justify="center"
  // alignItems="center"
  // spacing={12}
  // >
  <div>
    <AppBar />
    <GridList />
  </div>
)

export default Home
