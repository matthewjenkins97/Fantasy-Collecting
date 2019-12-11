import React from "react";
import { View } from "react-native";
//import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper'; 
import * as serverfuncs from '../serverfuncs';

import tileData from './tiledata';

class Form extends React.Component{
    constructor(props) {
      super(props);
    };
  
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
                {/* <form>  Username: <input type="text" name="fname"></input><br></br> */}
                Estimated Value (1-10): 
                <br></br>
                <input type="text" name="lname" min="1" max="10" maxlength="2"></input><br></br>
                <br></br>
                <Button size="small" variant="outlined" type="submit" value="Submit"
                style={{fontSize: 10, color: "#002f86"}}>Submit Estimate</Button>
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
        </div>
      );
    }
}

export default Form
