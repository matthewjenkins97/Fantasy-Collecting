import React, { Component } from 'react';
import ChatApp from './ChatApp.js';
import MailIcon from '@material-ui/icons/Mail';
import { default as Chatkit } from '@pusher/chatkit-server';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import { View } from "react-native";

const chatkit = new Chatkit({
  instanceLocator: "v1:us1:f04ab5ec-b8fc-49ca-bcfb-c15063c21da8",
  key: "32b71a31-bcc2-4750-9cff-59640b74814e:hQq+MMcoDqpXgMK0aPNPcm8uFHFDRmNDWcYNeiP2Zjg="
})

const userlist = [
    {
        username: "dholley"
    },
    {
        username: "mjenkins"
    }
]


class ChatMessage extends Component {
        constructor(props) {
            super(props);
            this.state = {
                currentView: false,
                chatView: false,
                otherChatter: undefined
              }
            this.changeView = this.changeView.bind(this);
        }
        changeView(current) {
            // let bool = true;
            // if (current === true) {
            //     bool = false;
            // }
            this.setState({
                currentView: !current
            })
            console.log(this.state.currentView);
        }

        changeChat(current, otheruser) {
            // let bool = true;
            // if (current === true) {
            //     bool = false;
            // }
            this.setState({
                chatView: !current,
                otherChatter: otheruser
            })
            console.log(this.state.chatView);
            console.log(this.state.otherChatter);
        }
        render() {
            return (
                <div>
                    <View style={{position: 'absolute', right: 0, bottom: 0, marginBottom: 400}}>
                    {  this.state.currentView ?  
                    (<CloseIcon onClick={() => this.changeView(this.state.currentView)}/>) 
                    : (null)   
                
                }
                    {  this.state.chatView ?  
                    (<CloseIcon onClick={() => this.changeChat(this.state.chatView)}/>) 
                    : (null)   
                
                }
                    </View>
                    <div>
                        {/* style={{color: "white"}} */}
                        <div>
                        <FormControl style={{position: "fixed", top: 150, width: 100}}>
                            <InputLabel style={{width: 100}}>Users</InputLabel>
                            <Select style={{width: 80}}>
                            {userlist.map(user => (
                            //<Button id={user.username} onClick={() => {{this.changeChat(this.state.chatView, document.getElementById({user.username}).id); console.log(document.getElementById({user.username}).id)}}}>dholley</Button>
                            <MenuItem><Button id={user.username} onClick={() => {this.changeChat(this.state.chatView, user.username)}}>{user.username}</Button></MenuItem>    
                            
                            //<Button style={{position: "fixed"}} id={user.username} onClick={() => {this.changeChat(this.state.chatView, user.username)}}>{user.username}</Button>
                            ))}
                            </Select>
                        </FormControl>
                        </div>
                        <MailIcon  style={{position: 'absolute', top: 200}} onClick={() => this.changeView(this.state.currentView)} />
                        { this.state.currentView ? (<div className="App"><div className="form-container">
                    <ChatApp general="general"/>
                </div></div>) : (null) }
                        { this.state.chatView ? (<div className="App"><div className="form-container">
                    <ChatApp otherUser={this.state.otherChatter}/>
                </div></div>) : (null) }
                    </div>
            </div>
            )
        }
    }
export default ChatMessage;