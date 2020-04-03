import React, {Component} from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TradeWindow from './tradewindow';
import OtherGallery from './homepageofother';
import {getAllArtworks, setBlurb, getUser} from '../serverfuncs';
import ChatComponent from '../components/ChatMessage';
import HistoryTable from '../components/historytable';
import './gallerydropdown.css';
import MicroresearchPrompt from '../components/microresearchprompt.js';
import MicroresearchTable from '../components/microresearchtable.js';
import Form from './form';
import './ratings.css';

var artinfo = {
  title: "monalisa",
  artist: "leo",
  img: "http://fantasycollecting.hamilton.edu/static/media/Brueghel___Rubens_Madonna_and_Child_1617.jpg"
};

class Single extends Component {
  constructor(props) {
    super(props);
    document.body.className = 'gallery';
  }

  render() {
    //var artwork = await getArtworkInfo();
    return (
      <div>
        <div>
          <div><ChatComponent /></div>
          <div><OtherGallery/></div>
          {/* <div><TradeWindow></TradeWindow></div> */}
        </div>
        <Typography fontFamily='roboto' variant='h4' component='h4' style={{
          textAlign: 'center',
          paddingTop: 20,
          paddingBottom: 10}}>My single</Typography>
        <div>
          <Grid
            container
            direction='row'
            justify='center'
            alignItems='left-justified'
          >


          <div style={{padding: 10}}>
            <img src={artinfo.img} alt={artinfo.title} style={{leftMargin: 'auto', rightMargin: 'auto', display: 'block', height: 500}}/>
            {/* <Paper style={{padding: 10}}>
              <div>
                <div style={{float: 'left',
                  width: '80%'}}>
                  <Typography variant='h6' fontFamily='roboto'>{title}</Typography>
                  <Typography variant='subtitle1' fontFamily='roboto'>{artist}, {year}</Typography>
                </div>
                <div style={{float: 'right',
                  width: '20%',
                  textAlign: 'right'}}>
                  <Typography variant='h4' fontFamily='roboto'>{actualprice !== 0 && actualprice !== undefined ? actualprice : theoreticalprice}</Typography>
                </div>
              </div>
              <div style={{marginTop: '1in'}}>
                <hr></hr>
                <HistoryTable identifier={identifier}/>
                <MicroresearchTable identifier={identifier}/>
                <MicroresearchPrompt identifier={identifier}/>
              </div>
            </Paper> */}
            {/* <GridListTileBar
              title={title}
              subtitle={<span>by: {artist}</span>}
            /> */}
          </div>



            {/* <div style={{padding: 10}}><img src='./static/monalisa.jpg' height={500}/>
              </div>
              <div style={{padding: 10}}><img src='./static/dance.jpg' height={500} /></div>
              <div style={{padding: 10}}><img src='./static/sunflowers.jpg' height={500}/></div> */}
          </Grid>
          <br />
          {/* <Typography fontFamily='roboto' variant='h4' component='h4' style={{
            textAlign: 'center',
            paddingTop: 20,
            paddingBottom: 10}}>My single Announcements</Typography>
          <div style={{textAlign: 'center'}}>
            <textarea style={{width: '50%', height: 100}} id='singleblurb' multiline='true'></textarea>
          </div> */}
          {/* <Button style={{margin: 'auto', display: 'block'}} onClick={this.saveBlurb}>Save</Button> */}
        </div>
        <button id = 'ratingbutton' onClick = {() => {
          this.openForm();
        }} className = 'openFormButton'>Rate Artworks</button>
        <div id = 'ratingpage' style = {{overflowX: 'hidden', color: 'white', zIndex: 10000, backgroundColor: 'rgba(0, 0, 0, .7)', position: 'absolute', top: '0px', width: '100%', left: '-100%', transition: '1s'}}>
          {/* <Form/> */}
        </div>
      </div>
    );
  }
}

export default Single;
