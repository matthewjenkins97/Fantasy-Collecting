import React, { useState } from "react";
import { View } from "react-native";
//import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper'; 
import * as serverfuncs from '../serverfuncs';

import Carousel from 'react-bootstrap/Carousel'
import tileData from './tiledata';

class Auction extends React.Component{
    constructor(props) {
      super(props);
    };
  
    render(){
      return (
        <div>
          <Typography fontFamily="roboto" variant="h4" component="h4" style={{ 
          textAlign: 'center',
          paddingTop: 20,
          paddingBottom: 10}}>Auction Page</Typography>
          {tileData.map(tile => (
            <View style={{padding: 10, flexDirection: 'row', justifyContent: 'center'}}>
              
              <img src={tile.img} alt={tile.title} height={200} style={{alignItem: 'center'}}/>
              <Paper style={{ padding: 10 }}>
                <Typography variant="h6" fontFamily="roboto" style={{textAlign: 'left', marginLeft: 20}}>{tile.title}</Typography>
                <Typography variant="subtitle1" fontFamily="roboto" style={{marginLeft: 20}}>By: {tile.artist}</Typography>

                <div style={{margin: 20,  }}>
                <form>  Username: <input type="text" name="fname"></input><br></br>
                Bid: <input type="text" name="lname"></input><br></br>
                <Button size="small" variant="contained" color="primary" type="submit" value="Submit">Submit Bid</Button></form>
                </div>
              <div style={{paddingTop: 5, position: 'relative', alignSelf: 'right', justifyContent: 'flex-end'}}>
              </div>
              </Paper>
              {/* <GridListTileBar
                title={tile.title}
                subtitle={<span>by: {tile.artist}</span>}
              /> */}
            </View>
          ))} 
        </div>
      );
    }
}

export default Auction
