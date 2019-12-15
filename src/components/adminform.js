import React from "react";
import { View } from "react-native";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper'; 
import * as serverfuncs from '../serverfuncs';

var tileData = [];

class AdminForm extends React.Component{
    constructor(props) {
      super(props);
      document.body.className = "background";
      this.state = {
        tileData: []
      }
      this.getArtworks();
    };
    async getAverageValue(ident) {
      var ratings = await fetch("http://fantasycollecting.hamilton.edu/api/ratetable/");
      ratings = await ratings.json();
      var average = 0;
      var numofratings = 0;
      for(var r in ratings) {
        if(ratings[r].identifier === ident) {
          numofratings++;
          average+=parseInt(ratings[r].price);
        }
      }
      average /= numofratings;
      return average;
    }
    async getArtworks() {
      tileData = [];
      var images = await fetch("http://fantasycollecting.hamilton.edu/api/artworks/");
      images = await images.json();
      for(var i in images) {
        if(images[i].rateable === 1) { 
          var av = await this.getAverageValue(images[i].identifier);
          tileData.push({
            img: images[i].url,
            title: images[i].title,
            artist: images[i].artist,
            identifier: images[i].identifier,
            average: av.toString().slice(0,5),
          });
        }
      }
      this.forceUpdate();
    }
  
    render(){
      return (
        <div style = {{color: "white"}}>
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
                <label>Average Value: 
                </label>
                <br></br>
                <p>{tile.average}</p>
                <br></br>
                <br></br>
                </form>
                </div>
              <div style={{paddingTop: 5, position: 'relative', alignSelf: 'right', justifyContent: 'flex-end'}}>
              </div>
              </Paper>
            </View>
          ))}
          <View style={{padding: 10, flexDirection: 'row', justifyContent: 'center'}}>  
              <div>
            <Button size="large" variant="contained" color="secondary" type="submit" value="Submit"
            style={{fontSize: 20, backgroundColor: "#002f86", alignItem: 'center', margin: 20}}
            onClick = {async () => {
              var images = await fetch("http://fantasycollecting.hamilton.edu/api/artworks/");
              images = await images.json();
              for(var i in images) {
                if(images[i].rateable === 1) {
                  var tp = await this.getAverageValue(images[i].identifier);
                  tp*=100;
                  tp = Math.round(tp);
                  console.log(tp);
                  await fetch("http://fantasycollecting.hamilton.edu/api/artworks/"+images[i].identifier, 
                  {
                    method: 'put',
                    mode: 'cors',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      theoreticalprice: tp,
                    }),
                  });
                }
              }
              serverfuncs.showNotification("hidden values of artworks assigned")
            }}>Create Hidden Values</Button> </div></View>

        </div>
      );
    }
}

export default AdminForm
