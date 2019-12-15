import React, { Component } from 'react';
import ChatApp from './ChatApp.js';
import { default as Chatkit } from '@pusher/chatkit-server';
import CloseIcon from '@material-ui/icons/Close';
import { View } from "react-native";
import * as serverfuncs from '../serverfuncs'
import './message.css';

const chatkit = new Chatkit({
  instanceLocator: "v1:us1:f04ab5ec-b8fc-49ca-bcfb-c15063c21da8",
  key: "32b71a31-bcc2-4750-9cff-59640b74814e:hQq+MMcoDqpXgMK0aPNPcm8uFHFDRmNDWcYNeiP2Zjg="
})

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
        }

        async getUsers(){
            
            var userlist = await serverfuncs.getAllUsers();
            this.setState({
                userList: userlist
            })
        }

        changeView(current) {
            this.setState({
                currentView: !current
            })
        }

        changeChat(current, otheruser) {
            this.setState({
                chatView: !current,
                otherChatter: otheruser
            })
        }

        async componentDidMount() {
            await this.getUsers();
            var c_ref = this;
            for(var user in this.state.userList) {
                if(this.state.userList[user].username !== localStorage.getItem("username")) {
                    var buttonnode = document.createElement("a");
                    buttonnode.style.padding = "0px 0px 5px 0px";
                    buttonnode.innerHTML = this.state.userList[user].username;
                    buttonnode.onclick = function() { 
                        c_ref.changeChat(c_ref.state.chatView, this.innerHTML);
                    }
                    document.getElementById("messageusers").appendChild(buttonnode);
                }
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
                            <div id="messageinit" className="sidebarinit">
                                <a className="closebtn" onClick={closeNav}>&times;</a>

                                <button className="dropbtn">Users</button>

                                <div id = "messageusers" className="dropdown-content"></div>
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