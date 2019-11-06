import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import AppBar from './appbar';
import Typography from '@material-ui/core/Typography';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Paper from '@material-ui/core/Paper'; 
import Popper from './popper';
import Table from './table';
import tileData from './tiledata';


var addTrade = false;

class Main extends Component  {

  constructor(props){
    super(props);
  }

  addTradeWindow(thisclass) {
    addTrade = true;
    thisclass.forceUpdate();
  }

  render() {
    return(
      <div>
        {/* <PinGrid /> */}
        {/* <GridList /> */}
        <div id = "testing">
          {addTrade ? (<div><TradeWindow></TradeWindow></div>) : (<div></div>)}
        <button onClick = { () => this.addTradeWindow(this) } >
        trade button test
        </button>
        </div>
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