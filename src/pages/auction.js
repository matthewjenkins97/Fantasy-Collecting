import React, { Component } from "react";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import ChatComponent from "../components/ChatMessage";
import Typography from '@material-ui/core/Typography';
import * as serverfuncs from "../serverfuncs";
import AuctionStudent from "../components/studentauction";
import SimpleMenu from "../components/simpleMenu";
import Grid from '@material-ui/core/Grid';
import Notification from '../components/notification';
import Guilder from '../static/guilder.svg';

class AuctionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      guilders: 0
    }
    this.getGuilders = this.getGuilders.bind(this);
    this.getGuilders();
  }

  

  async getGuilders(){
    var guilders = 0;       
    var userlist = await serverfuncs.getUser(localStorage.getItem('username'));
    this.setState({
      guilders: userlist[0].guilders
    })
    this.guilders = userlist[0].guilders;
    // console.log("GUILDERS IS IT HERE");
    // console.log(guilders)
  }

    render() {
    return(
        <div>
          <Notification/>
                <AppBar position="fixed" style={{backgroundColor: "#002f86"}}>
                      <Toolbar variant="dense">
                        
                      <Grid
                        justify="space-between"
                        container spacing={1}
                      >
                        <Grid item xs={'90%'}>
                          <SimpleMenu mode={false}/>
                             {/* {SimpleMenu()} */}
                        </Grid>
                        <Grid item xs>
                            <Typography variant="h6" color="inherit" style={{marginTop: 9}}>
                              Fantasy Collecting -&nbsp;{localStorage.getItem('username')}
                            </Typography>
                            {/* <Typography variant="h6" color="inherit">
                              {localStorage.getItem('username')}
                            </Typography> */}
                          
                        </Grid>
                        <Grid item xs>
                            
                            <Typography variant="h6" style={{float: 'right', marginTop: 10}}>
                              {/* <i style={{alignSelf: 'center'}} class="material-icons">
                                monetization_on
                                </i>   */}
                                <img src={Guilder}  height="20" width="20"></img>
                                  {this.state.guilders}</Typography>
                            </Grid>
                      </Grid>
                      
                      </Toolbar>
                </AppBar>
                <br></br>
                <br></br>
            <div><ChatComponent /></div>
            <AuctionStudent/>
            {/* <h1>Login</h1>
            username:<input type = 'text' id = 'liusername'></input>
            <p></p>password:<input type = 'text' id = 'lipassword'></input>
            <p></p><button onClick = {serverfuncs.logInUser}>log in</button>
            <p></p><button onClick = {serverfuncs.logOutUser}>log out</button> */}
        </div>
    )
  }

}

export default AuctionPage