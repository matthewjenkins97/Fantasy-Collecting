import React, { Component } from 'react';
import ChatApp from './ChatApp.js';
import { default as Chatkit } from '@pusher/chatkit-server';
import CloseIcon from '@material-ui/icons/Close';
import { View } from "react-native";
import { ChatManager, TokenProvider, ChatkitProvider } from '@pusher/chatkit-client';
import * as serverfuncs from '../serverfuncs'
import './message.css';
export {checkForMessages, setRoomCount};

// for connecting to chatrooms
var chatManager;

// initializing the chatkit connection to server
const chatkit = new Chatkit({
    instanceLocator: "v1:us1:f04ab5ec-b8fc-49ca-bcfb-c15063c21da8",
    key: "32b71a31-bcc2-4750-9cff-59640b74814e:hQq+MMcoDqpXgMK0aPNPcm8uFHFDRmNDWcYNeiP2Zjg="
})


// function for opening menu for messaging
function openNav() {
    document.getElementById("messageinit").style.left = "0px";
    document.getElementById("messagebutt").style.left = "210px";
    document.getElementById("messagealert").style.left = "380px";
}

// function for closing menu for messaging
function closeNav() {
    document.getElementById("messageinit").style.left = "-200px";
    document.getElementById("messagebutt").style.left = "10px";
    document.getElementById("messagealert").style.left = "180px";
}

// called every few seconds to check for new messages
async function checkForMessages() {
    if(typeof localStorage.getItem('username') === 'undefined' || localStorage.getItem('username') === null) return;

    //set chat manager if not set yet
    if(typeof chatManager === 'undefined' || chatManager.userId !== localStorage.getItem('username')) {
        chatManager = await new ChatManager({
            instanceLocator: "v1:us1:f04ab5ec-b8fc-49ca-bcfb-c15063c21da8",
            userId: localStorage.getItem('username'),
            tokenProvider: new TokenProvider({
                url: "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/f04ab5ec-b8fc-49ca-bcfb-c15063c21da8/token"
            })
        });
    }

    var areMessages = false;
    var cm = await chatManager.connect();

    try {
    for(var r in cm.rooms) {
        try{
            var nan = document.getElementById(cm.rooms[r].name).innerHTML.toString();
            nan = nan;
        }catch{
            continue;
        }
        var num = await getRoomMessagesForThisUser(cm.rooms[r].name);
        if(num < cm.rooms[r].unreadCount) {
            areMessages = true;
            document.getElementById(cm.rooms[r].name).innerHTML = document.getElementById(cm.rooms[r].name).innerHTML.split(" ")[0] + " !";
        }
        else {
            document.getElementById(cm.rooms[r].name).innerHTML = document.getElementById(cm.rooms[r].name).innerHTML.split(" ")[0];
        }
    }
    if(areMessages) {
        document.getElementById("messagealert").style.display = 'block';
    }
    else {
        document.getElementById("messagealert").style.display = 'none';
    }
    }catch{}
}

async function getRoomMessagesForThisUser(id) {
    var rooms = await fetch('http://fantasycollecting.hamilton.edu/api/messages/'+localStorage.getItem('username')+'/'+id);
    rooms = await rooms.json();
    for(var room in rooms) {
        if(rooms[room].room.toString() === id.toString()) {
            return rooms[room].messagecount;
        }
    }
    return -1;
}

// set room count for one room
async function setRoomCount(id, count) {
    let mroomcount = await fetch('http://fantasycollecting.hamilton.edu/api/messages/'+localStorage.getItem('username')+'/'+id);
    mroomcount = await mroomcount.json();
    if(mroomcount.length === 0) {
        await fetch('http://fantasycollecting.hamilton.edu/api/messages/', {
            method: 'post',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: localStorage.getItem('username'),
                room: id,
                messagecount: count
            })
        });
    }
    else {
        await fetch('http://fantasycollecting.hamilton.edu/api/messages/'+localStorage.getItem('username')+'/'+id, {
            method: 'put',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messagecount: count
            })
        });
    }
}



class ChatMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: false, //general open or not
            chatView: false, //DM open or not
            otherChatter: undefined,
            userList: [],
            unread: []
        }
        this.changeView = this.changeView.bind(this);
        this.setUnread = this.setUnread.bind(this);
        // this.managechats();
    }

    // fetch all users from database
    async getUsers(){
        var userlist = await serverfuncs.getAllUsers();
        this.setState({
            userList: userlist
        })
    }

    // change to general chatroom window
    async changeView(current) {
        this.setState({
            currentView: !current
        })
        chatManager = await new ChatManager({
            instanceLocator: "v1:us1:f04ab5ec-b8fc-49ca-bcfb-c15063c21da8",
            userId: localStorage.getItem('username').toString(),
            tokenProvider: new TokenProvider({
                url: "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/f04ab5ec-b8fc-49ca-bcfb-c15063c21da8/token"
            })
        })

        var cm = await chatManager.connect();
        await this.setUnread(cm.rooms);
        
        for (var i = 0; i < this.state.unread.length; i++){
            if (this.state.unread[i][0].toString() === "General") {
                await setRoomCount("General", this.state.unread[i][1]);
            }
        }
    }

    // change chatroom window
    async changeChat(current, otheruser) {
        this.setState({
            chatView: !current,
            otherChatter: otheruser
        })            
        chatManager = await new ChatManager({
            instanceLocator: "v1:us1:f04ab5ec-b8fc-49ca-bcfb-c15063c21da8",
            userId: localStorage.getItem('username').toString(),
            tokenProvider: new TokenProvider({
                url: "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/f04ab5ec-b8fc-49ca-bcfb-c15063c21da8/token"
            })
        })

        var cm = await chatManager.connect();
        await this.setUnread(cm.rooms);

        let roomName = [otheruser, localStorage.getItem('username')];
        roomName = roomName.sort().join("_") + "_room";
        if(otheruser === "General") roomName = "General";
        if (this.state.chatView == true){
            for (var i = 0; i < this.state.unread.length; i++){
                if (this.state.unread[i][0].toString() === roomName){
                    await setRoomCount(roomName, this.state.unread[i][1]);
                }
            }
        }
    }

        // update the amount of messages in room for client side
        async setUnread(rooms){
            this.setState({unread: []})
            if(typeof rooms === 'undefined') return;
            for (var i = 0; i < rooms.length; i++){
                if (rooms[i].name !== ""){
                    this.setState({
                        unread: [...this.state.unread, [rooms[i].name, rooms[i].unreadCount]],
                    })
                }
            }
        }

        // called in constructor
        async managechats(){
            // chatManager = new ChatManager({
            //     instanceLocator: "v1:us1:f04ab5ec-b8fc-49ca-bcfb-c15063c21da8",
            //     userId: localStorage.getItem('username').toString(),
            //     tokenProvider: new TokenProvider({
            //         url: "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/f04ab5ec-b8fc-49ca-bcfb-c15063c21da8/token"
            //     })
            // })
            // var cm = await chatManager.connect();
            // for(var r in cm.rooms) {
            //     if(typeof cm.rooms[r] !== 'undefined') {
            //         //await postRoomData(cm.rooms[r].name);
            //     }
            // }
            // //await postRoomData("General");
            // //await this.setUnread(cm.rooms);
        }

        // async chatnumber(otheruser){
        //     let roomName = [otheruser, localStorage.getItem('username')];
        //     roomName = roomName.sort().join("_") + "_room";
        //     if (otheruser == "General"){
        //         roomName = "642a21e5-92e6-42fd-8966-b4a151d7ea94";
        //     }
        //     var cm = await chatManager.connect();
        //     for(var room in cm.rooms) {
        //         if(cm.rooms[room].id === roomName) {
        //             //console.log(cm.rooms[room].unreadCount);
        //             //var userm;
        //             if(otheruser === "General") {
        //                 //var userm = await getRoomMessagesForThisUser("General");
        //             }
        //             else {
        //                 //var userm = await getRoomMessagesForThisUser(cm.rooms[room].id);
        //             }
        //             // console.log(cm.rooms[room].id);
        //             // console.log(userm);
        //             // if(userm < cm.rooms[room].unreadCount && userm !== -1) {
        //             //     return " !";
        //             // }
        //             // else {
        //                 return "";
        //             //}
        //         }
        //     }
        // }

        async componentDidMount() {
            await this.getUsers();
            await this.managechats();
            var c_ref = this;
            for(var user in this.state.userList) {
                if(this.state.userList[user].username !== localStorage.getItem("username")) {
                    var buttonnode = document.createElement("a");
                    buttonnode.style.padding = "0px 0px 5px 0px";
                    let roomName = [this.state.userList[user].username, localStorage.getItem('username')];
                    roomName = roomName.sort().join("_") + "_room";
                    buttonnode.id = roomName;

                    buttonnode.innerHTML = this.state.userList[user].username;

                    buttonnode.onclick = function() { 
                        c_ref.changeChat(c_ref.state.chatView, this.innerHTML.split(' ')[0]);
                    }
                    document.getElementById("messageusers").appendChild(buttonnode);
                }
            }

            var buttonnode = document.createElement("a");
            buttonnode.style.padding = "0px 0px 5px 0px"
            buttonnode.id = "General";
            buttonnode.innerHTML = "General";
            buttonnode.onclick = function() { 
                c_ref.changeView(c_ref.state.currentView);
            }

            document.getElementById("messageusers").appendChild(buttonnode);
        }

        render() {
            return (
                <div>
                    <div style={{zIndex: 1, position: "fixed"}}>
                        <p id = "messagebutt" onClick = {openNav} className = "messageButton">Message Users
                        </p>
                        <div id="messageinit" className="sidebarinitm">
                            <a className="closebtn" onClick={closeNav}>&times;</a>

                            <button className="dropbtn">Users</button>

                            <div id = "messageusers" className="dropdown-contentm"></div>
                        </div>
                        <div id = "messagealert" className = "messagealert">!</div>
                    </div>

                    <div style={{zIndex: 10, position: "fixed"}}>
                        <View style={{position: 'fixed', right: 0, bottom: 0, marginBottom: 400}}>
                        {  this.state.currentView ?  
                        (<CloseIcon style={{cursor: "pointer", background: 'white', borderRadius: "10px", position: "fixed", bottom: "410px", right: "20px"}} onClick={() => this.changeView(this.state.currentView)}/>) 
                        : (null)   
                    
                        }
                        {  this.state.chatView ?  
                        (<CloseIcon style={{cursor: "pointer", background: 'white', borderRadius: "10px", position: "fixed", bottom: "410px", right: "20px"}} onClick={() => this.changeChat(this.state.chatView)}/>) 
                        : (null)   
                    
                        }
                        </View>
                        <div>
                            { this.state.currentView ? (<div className="App"><div className="form-container">
                                <ChatApp general="general" style={{position: "fixed", flex: 1}}/>
                                </div></div>) : (null) }
                            { this.state.chatView ? (<div className="App"><div className="form-container">
                                <ChatApp otherUser={this.state.otherChatter.split(' ')[0]} style={{position: "fixed",flex: 1}}/>
                                </div></div>) : (null) }
                        </div>
                </div>
            </div>
            )
        }
    }
export default ChatMessage;