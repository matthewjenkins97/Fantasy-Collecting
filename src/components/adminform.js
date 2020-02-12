import React from 'react';
import {View} from 'react-native';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import * as serverfuncs from '../serverfuncs';

let tileData = [];

class AdminForm extends React.Component {
  constructor(props) {
    super(props);
    document.body.className = 'background';
    this.state = {
      tileData: [],
    };
    this.getArtworks();
  };

  async getAverageValue(ident) {
    let ratings = await fetch('http://fantasycollecting.hamilton.edu/api/ratetable/');
    ratings = await ratings.json();
    let average = 0;
    let numofratings = 0;
    for (const r in ratings) {
      if (ratings[r].identifier === ident) {
        numofratings++;
        average+=parseInt(ratings[r].price);
      }
    }
    average /= numofratings;
    return average;
  }

  async getArtworks() {
    tileData = [];
    let images = await fetch('http://fantasycollecting.hamilton.edu/api/artworks/');
    images = await images.json();
    for (const i in images) {
      if (images[i].rateable === 1) {
        const av = await this.getAverageValue(images[i].identifier);
        tileData.push({
          img: images[i].url,
          title: images[i].title,
          artist: images[i].artist,
          identifier: images[i].identifier,
          average: av.toString().slice(0, 5),
        });
      }
    }
    this.forceUpdate();
  }

  render() {
    return (
      <div style = {{color: 'white'}}>
        <Typography fontFamily='roboto' letiant='h4' component='h4' style={{
          textAlign: 'center',
          paddingTop: 20,
          paddingBottom: 10}}>Estimated Values</Typography>
        {tileData.map((tile) => (
          <View style={{padding: 10, flexDirection: 'row', justifyContent: 'center'}}>
            <img src={tile.img} alt={tile.title} height={300} style={{alignItem: 'center'}}/>
            <Paper style={{padding: 10}}>
              <Typography letiant='h6' fontFamily='roboto' style={{textAlign: 'left', marginLeft: 20}}>{tile.title}</Typography>
              <Typography letiant='subtitle1' fontFamily='roboto' style={{marginLeft: 20}}>By: {tile.artist}</Typography>
              <div style={{margin: 20}}>
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
            <Button size='large' letiant='contained' color='secondary' type='submit' value='Submit' style={{fontSize: 20, backgroundColor: '#002f86', alignItem: 'center', margin: 20}} onClick = {async () => {
              let images = await fetch('http://fantasycollecting.hamilton.edu/api/artworks/');
              images = await images.json();
              for (const i in images) {
                if (images[i].rateable === 1) {
                  let tp = await this.getAverageValue(images[i].identifier);
                  tp*=100;
                  tp = Math.round(tp);
                  // console.log(tp);
                  await fetch('http://fantasycollecting.hamilton.edu/api/artworks/'+images[i].identifier,
                      {
                        method: 'put',
                        mode: 'cors',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          theoreticalprice: tp,
                        }),
                      });
                }
              }
              serverfuncs.showNotification('theoretical prices of artworks assigned');
            }}>Create Theoretical Prices</Button> </div></View>
      </div>
    );
  }
}

export default AdminForm;
