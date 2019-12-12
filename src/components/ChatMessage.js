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
import * as serverfuncs from '../serverfuncs'
import { Menu } from '@material-ui/core';
import './message.css';

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
    },
    {
        username: "jopatrny"
    }
]

function openNav() {
    document.getElementById("messageinit").style.left = "0px";
    document.getElementById("messagebutt").style.left = "210px";
  }
  
function closeNav() {
  document.getElementById("messageinit").style.left = "-200px";
  document.getElementById("messagebutt").style.left = "10px";
}



class ChatMessage extends Component {
        constructor(props) {
            super(props);
            this.state = {
                currentView: false, //general open or not
                chatView: false, //DM open or not
                otherChatter: undefined,
                userList: []
              }
            this.changeView = this.changeView.bind(this);
            //this.getUsers = this.getUsers.bind(this);
        }

        async getUsers(){
            
            var userlist = await serverfuncs.getAllUsers();
            this.setState({
                userList: userlist
            })
            console.log("USERS");
            console.log(this.state.userList);
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

        async componentDidMount() {
            await this.getUsers();
            var c_ref = this;
            console.log("mounted");
            for(var user in this.state.userList) {
                var buttonnode = document.createElement("a");
                // buttonnode.id = "user_t"+user.toString();
                buttonnode.style.padding = "0px 0px 5px 0px";
                buttonnode.innerHTML = this.state.userList[user].username;
                buttonnode.onclick = function() { 
                    c_ref.changeChat(c_ref.state.chatView, this.innerHTML);
                }
                document.getElementById("messageusers").appendChild(buttonnode);
            }

            var buttonnode = document.createElement("a");
            // buttonnode.id = "user_t"+user.toString();
            buttonnode.style.padding = "0px 0px 5px 0px";
            buttonnode.innerHTML = "General Room";
            buttonnode.onclick = function() { 
                c_ref.changeView(c_ref.state.currentView);
            }
            document.getElementById("messageusers").appendChild(buttonnode);
        }

        render() {
            return (
                <div style={{zIndex: 10, position: "fixed"}}>
                    <View style={{position: 'fixed', right: 0, bottom: 0, marginBottom: 380}}>
                    {  this.state.currentView ?  
                    (<CloseIcon style={{background: 'white', zIndex: 300}} onClick={() => this.changeView(this.state.currentView)}/>) 
                    : (null)   
                
                    }
                    {  this.state.chatView ?  
                    (<CloseIcon style={{background: 'white', zIndex: 99}} onClick={() => this.changeChat(this.state.chatView)}/>) 
                    : (null)   
                
                    }
                    </View>
                    <div>
                        {/* style={{color: "white"}} */}
                        <div>
                            <p id = "messagebutt" onClick = {openNav} className = "messageButton">Message Users
                            </p>
                            <div id="messageinit" class="sidebarinit">
                                <a class="closebtn" onClick={closeNav}>&times;</a>

                                <button class="dropbtn">Users</button>

                                <div id = "messageusers" class="dropdown-content"></div>
                            </div>
                        </div>
                        {/* <MailIcon  style={{position: 'absolute', top: 240}} onClick={() => this.changeView(this.state.currentView)} /> */}
                        { this.state.currentView ? (<div className="App"><div className="form-container">
                    <ChatApp general="general" style={{position: "fixed", flex: 1, zIndex: 5}}/>
                </div></div>) : (null) }
                        { this.state.chatView ? (<div className="App"><div className="form-container">
                    <ChatApp otherUser={this.state.otherChatter} style={{position: "fixed",flex: 1, zIndex: 5}}/>
                </div></div>) : (null) }
                    </div>
            </div>
            )
        }
    }
export default ChatMessage;