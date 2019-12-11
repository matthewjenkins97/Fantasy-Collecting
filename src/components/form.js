import React from "react";
import { View } from "react-native";
//import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper'; 
import * as serverfuncs from '../serverfuncs';

//import tileData from './tiledata';

var tileData = [];

class Form extends React.Component{
    constructor(props) {
      super(props);
      this.state = {
        tileData: []
      }
      this.getArtworks();
    };

    async getArtworks() {
      var images = await fetch("http://fantasycollecting.hamilton.edu/api/artworks/");
      images = await images.json();
      for(var i in images) {
        if(images[i].rateable === 1) { 
          tileData.push({
            img: images[i].url,
            title: images[i].title,
            artist: images[i].artist,
          });
        }
      }
      this.forceUpdate();
    }
  
    render(){
      return (
        <div>
          <Typography fontFamily="roboto" variant="h4" component="h4" style={{ 
          textAlign: 'center',
          paddingTop: 20,
          paddingBottom: 10}}>Estimated Values</Typography>
          {tileData.map(tile => (
            <View style={{padding: 10, flexDirection: 'row', justifyContent: 'center'}}>
              
              <img src={tile.img} alt={tile.title} height={300} style={{alignItem: 'center'}}/>
              <Paper style={{ padding: 10 }}>
                <Typography variant="h6" fontFamily="roboto" style={{textAlign: 'left', marginLeft: 20}}>{tile.title}</Typography>
                <Typography variant="subtitle1" fontFamily="roboto" style={{marginLeft: 20}}>By: {tile.artist}</Typography>
                
                <div style={{margin: 20,  }}>
                <form>
                {/* <form>  Username: <input type="text" name="fname"></input><br></br> */}
                <label>Estimated Value (1-10): 
                <br></br>
                <input type="text" name="lname" min="1" max="10" maxlength="2"></input><br></br></label>
                <br></br>
                <br></br>
                <br></br>
                </form>
                {/* </form> */}
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
          <View style={{padding: 10, flexDirection: 'row', justifyContent: 'center'}}>  
              <div>
            <Button size="large" variant="contained" color="secondary" type="submit" value="Submit"
            style={{fontSize: 20, backgroundColor: "#002f86", alignItem: 'center', margin: 20}}>SUBMIT FORM</Button> </div></View>

        </div>
      );
    }
}

export default Form
