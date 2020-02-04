import React from "react";
import { View } from "react-native";
//import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper'; 
import * as serverfuncs from '../serverfuncs';
import { relative } from "path";

//import tileData from './tiledata';

var tileData = [];

class Form extends React.Component{
    constructor(props) {
      super(props);
      this.state = {
        tileData: []
      }
      this.getArtworks();
      this.checkIfDone();
    };
    OnComponentDidMount() {
      this.checkIfDone();
    }
    async getArtworks() {
      var images = await fetch("http://fantasycollecting.hamilton.edu/api/artworks/");
      images = await images.json();
      for(var i in images) {
        if(images[i].rateable === 1) { 
          tileData.push({
            img: images[i].url,
            title: images[i].title,
            artist: images[i].artist,
            identifier: images[i].identifier,
          });
        }
      }
      this.forceUpdate();
    }

    
    async checkIfDone() {
      const users = await serverfuncs.getAllUsers();
      for(var u in users) {
        if(users[u].username === localStorage.getItem('username')) {
          if(users[u].formcompleted === 0) {
            document.getElementById("ratingbutton").style.display = "inline-block";
          }
        }
      }
    }
  
    render(){
      return (
        <div>
          <Typography fontFamily="roboto" variant="h4" component="h4" style={{ 
          textAlign: 'center',
          paddingTop: 20,
          paddingBottom: 10}}>Estimated Values</Typography>
          <form>
          {tileData.map(tile => (
            <View style={{padding: 10, flexDirection: 'row', justifyContent: 'center'}}>
              
              <img src={tile.img} alt={tile.title} height={300} style={{alignItem: 'center'}}/>
              <Paper style={{ padding: 10 }}>
                <Typography variant="h6" fontFamily="roboto" style={{textAlign: 'left', marginLeft: 20}}>{tile.title}</Typography>
                <Typography variant="subtitle1" fontFamily="roboto" style={{marginLeft: 20}}>By: {tile.artist}</Typography>
                
                <div style={{margin: 20,  }}>
                {/* <form>  Username: <input type="text" name="fname"></input><br></br> */}
                <label>Estimated Value (1-10): 
                <br></br>
                <input id = {"rate"+tile.identifier} type="number" name="lname" min="1" max="10" maxlength="2"></input><br></br></label>
                <br></br>
                <br></br>
                <br></br>
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
            style={{fontSize: 20, backgroundColor: "#002f86", alignItem: 'center', margin: 20}}
            onClick = {async () => {
              
              var images = await fetch("http://fantasycollecting.hamilton.edu/api/artworks/");
              images = await images.json();
              for(var i in tileData) {
                var ratingIdentifier = document.getElementById("rate"+tileData[i].identifier);
                var rating = ratingIdentifier.value;
                console.log("Before:" + rating);
                if (ratingIdentifier.value > 10) {
                  rating = 10;
                } else if (ratingIdentifier.value < 1) { // this handles null cases as well as ones where the value is less than 0
                  rating = 1;
                }
                console.log("After:" + rating);
                await fetch("http://fantasycollecting.hamilton.edu/api/ratetable/", {
                  method: 'post',
                  headers: {'Content-Type': 'application/json'},
                  mode: 'cors',
                  body: JSON.stringify({
                    identifier: tileData[i].identifier,
                    price: rating
                  })
                });
              }
              await fetch("http://fantasycollecting.hamilton.edu/api/users/"+localStorage.getItem('username'), {
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                mode: 'cors',
                body: JSON.stringify({
                  formcompleted: 1
                })
              });
              document.getElementById("ratingpage").style.left = "-100%";
              document.getElementById("ratingbutton").style.display = "none";

            }}>SUBMIT FORM</Button> </div></View>

        </form>
        </div>
      );
    }
}

export default Form
