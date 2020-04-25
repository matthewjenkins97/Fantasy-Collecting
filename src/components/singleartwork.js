import React, {Component} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import OtherGallery from './homepageofother';
import ChatComponent from '../components/ChatMessage';
import './gallerydropdown.css';
import {getArtworkInfo, getUser} from '../serverfuncs.js';
import Paper from '@material-ui/core/Paper';
import HistoryTable from '../components/historytable';
import MicroresearchPrompt from '../components/microresearchprompt.js';
import MicroresearchTable from '../components/microresearchtable.js';
import TradeWindow from './tradewindow';

class Single extends Component {
  constructor(props) {
    super(props);

    this.getArtworkInformation = this.getArtworkInformation.bind(this);
    this.render = this.render.bind(this);

    this.identifier = localStorage.getItem('singleIdent');

    this.artworkInfo = {};
    this.getArtworkInformation();

    document.body.className = 'gallery';
  }

  async getArtworkInformation() {
    this.artworkInfo = await getArtworkInfo(this.identifier);
    this.currentUser = localStorage.getItem('username');
    this.forceUpdate();
  }

  render() {
    return (
      <div>
        <div>
          <div><ChatComponent/></div>
          <div><OtherGallery/></div>
          <div><TradeWindow></TradeWindow></div>
        </div>
        <Typography fontFamily='roboto' variant='h4' component='h4' style={{
          textAlign: 'center',
          paddingTop: 20,
          paddingBottom: 10}}>More Information</Typography>
        <div>
          <Grid
            container
            direction='row'
            justify='center'
            alignItems='left-justified'
          >
            <div style={{padding: 10}}>
              <div style={{float: 'left'}}>
                <img src={this.artworkInfo.url} alt={this.artworkInfo.title} style={{leftMargin: 'auto', rightMargin: 'auto', display: 'block', height: 300}}/>
              </div>
              <div style={{float: 'right'}}>
                <Paper style={{height: 300}}>
                  <div style={{padding: 10}}>
                    <Typography variant='h6' fontFamily='roboto'>{this.artworkInfo.title}</Typography>
                    <Typography variant='h6' fontFamily='roboto'>{this.artworkInfo.artist} </Typography>
                    <Typography variant='h6' fontFamily='roboto'>{this.artworkInfo.year} </Typography>
                    <br></br>
                    <Typography variant='subtitle1' fontFamily='roboto'>
                    Most recent sale price: {this.artworkInfo.actualprice !== 0 && this.artworkInfo.actualprice !== undefined ? this.artworkInfo.actualprice : 'N/A'} 
                    </Typography>
                    <br></br>
                    <HistoryTable identifier = {this.identifier} />
                    <MicroresearchTable identifier = {this.identifier} />
                    {(this.currentUser === this.artworkInfo.owner ? <MicroresearchPrompt identifier = {this.identifier} /> : <br />)}
                  </div>
                </Paper>
              </div>
            </div>
          </Grid>
          <br />
        </div>
      </div>
    );
  }
}

export default Single;
