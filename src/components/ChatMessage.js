import React, { Component } from 'react';
import ChatApp from './ChatApp.js';
import { default as Chatkit } from '@pusher/chatkit-server';
import CloseIcon from '@material-ui/icons/Close';
import { View } from "react-native";
import { ChatManager, TokenProvider, ChatkitProvider } from '@pusher/chatkit-client';
import * as serverfuncs from '../serverfuncs'
import './message.css';
export {checkForMessages};

var chatManager;// = new ChatManager({
//     instanceLocator: "v1:us1:f04ab5ec-b8fc-49ca-bcfb-c15063c21da8",
//     userId: localStorage.getItem('username').toString(),
//     //userId: this.props.currentId,
//     tokenProvider: new TokenProvider({
//         url: "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/f04ab5ec-b8fc-49ca-bcfb-c15063c21da8/token"
//     })
// });
const chatkit = new Chatkit({
  instanceLocator: "v1:us1:f04ab5ec-b8fc-49ca-bcfb-c15063c21da8",
  key: "32b71a31-bcc2-4750-9cff-59640b74814e:hQq+MMcoDqpXgMK0aPNPcm8uFHFDRmNDWcYNeiP2Zjg="
})



function openNav() {
    document.getElementById("messageinit").style.left = "0px";
    document.getElementById("messagebutt").style.left = "210px";
    document.getElementById("messagealert").style.left = "380px";
  }
  
function closeNav() {
  document.getElementById("messageinit").style.left = "-200px";
  document.getElementById("messagebutt").style.left = "10px";
  document.getElementById("messagealert").style.left = "180px";
}

async function checkForMessages() {
    if(typeof localStorage.getItem('username') === 'undefined') return;
    if(typeof chatManager === 'undefined' || chatManager.uerId !== localStorage.getItem('username')) {
        chatManager = new ChatManager({
        instanceLocator: "v1:us1:f04ab5ec-b8fc-49ca-bcfb-c15063c21da8",
        userId: localStorage.getItem('username'),
        //userId: this.props.currentId,
        tokenProvider: new TokenProvider({
            url: "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/f04ab5ec-b8fc-49ca-bcfb-c15063c21da8/token"
        })
    });
    }
    var areMessages = false;
    var cm = chatManager.connect();
    for(var r in cm.rooms) {
        if(cm.rooms[r].name === "" || cm.rooms[r].name === null || cm.rooms[r].name === localStorage.getItem('username')+'_'+localStorage.getItem('username')+'_'+'room') continue;
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
        document.getElementById("messagealert").style.display = 'block';
    }
}

async function postRoomData(name) {
    var rooms = await fetch('http://fantasycollecting.hamilton.edu/api/messages/'+localStorage.getItem('username'));
    rooms = await rooms.json();
    for(var r in rooms) {
        if(typeof name === 'undefined') return;
        if(rooms[r].room.toString() === name.toString()) return;
    }
    await fetch('http://fantasycollecting.hamilton.edu/api/messages/', {
        method: 'post',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "username": localStorage.getItem('username'),
            "room": name.toString(),
            "messagecount": 0,
        })
    })
}

async function getRoomMessagesForThisUser(id) {
    var rooms = await fetch('http://fantasycollecting.hamilton.edu/api/messages/'+localStorage.getItem('username'));
    rooms = await rooms.json();
    for(var room in rooms) {
        if(rooms[room].room.toString() === id.toString()) {
            console.log(rooms[room].messagecount);
            return rooms[room].messagecount;
        }
    }
}

async function setRoomCount(id, count) {
    var rooms = await fetch('http://fantasycollecting.hamilton.edu/api/messages/'+localStorage.getItem('username'));
    rooms = await rooms.json();
    await fetch('http://fantasycollecting.hamilton.edu/api/messages/'+localStorage.getItem('username'), {
        method: 'delete',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    for(var r in rooms) {
        if(rooms[r].id === id) {
            rooms[r].messagecount = count
        }
        console.log(rooms[r]);
        await fetch('http://fantasycollecting.hamilton.edu/api/messages/', {
            method: 'post',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(rooms[r])
        })
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
            //this.manageChats = this.managechats.bind(this);
            this.managechats();
            // this.setUnread()
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
            let roomName = [otheruser, localStorage.getItem('username')];
            roomName = roomName.sort().join("_") + "_room";
            console.log(roomName);
            if (this.state.chatView == true){
                console.log("HERE");
                var i;
                for (i = 0; i < this.state.unread.length; i++){
                    //console.log(this.state.unread[i]);
                    if (this.state.unread[i][0] === roomName){
                        setRoomCount(roomName, this.state.unread[i][1]);
                        //console.log(this.state.unread[i][1]);
                    }
                }
            }
        }

        setUnread(rooms){
            //console.log(rooms.length);
            var i;
            for (i = 0; i < rooms.length; i++){
                //console.log(rooms[i].name);
                if (rooms[i].name !== ""){
                    this.setState({
                        unread: [...this.state.unread, [rooms[i].name, rooms[i].unreadCount]],
                    })
                }
            }
            console.log(rooms);
            // for (var room in rooms){
  
            //     this.setState({
            //         unread: [...this.state.unread, [room.name, room.unreadCount]],
            //     })
            // }
        }

        async managechats(){
            chatManager = new ChatManager({
                instanceLocator: "v1:us1:f04ab5ec-b8fc-49ca-bcfb-c15063c21da8",
                userId: localStorage.getItem('username').toString(),
                //userId: this.props.currentId,
                tokenProvider: new TokenProvider({
                    url: "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/f04ab5ec-b8fc-49ca-bcfb-c15063c21da8/token"
                })
            })
            // let roomName = [this.state.otherChatter, localStorage.getItem('username')];
            // roomName = roomName.sort().join("_") + "_room";
            var cm = await chatManager.connect();
            for(var r in cm.rooms) {
                if(typeof cm.rooms[r] !== 'undefined')
                await postRoomData(cm.rooms[r].name);
            }
            await postRoomData("General")
            this.setUnread(cm.rooms);
        }

        async chatnumber(otheruser){
            let roomName = [otheruser, localStorage.getItem('username')];
            roomName = roomName.sort().join("_") + "_room";
            if (otheruser == "General"){
                roomName = "642a21e5-92e6-42fd-8966-b4a151d7ea94";
            }
            var cm = await chatManager.connect();
            for(var room in cm.rooms) {
                if(cm.rooms[room].id === roomName) {
                    console.log(cm.rooms[room].unreadCount);
                    var userm;
                    if(otheruser === "General") {
                        var userm = await getRoomMessagesForThisUser("General");
                    }
                    else {
                        var userm = await getRoomMessagesForThisUser(cm.rooms[room].id);
                    }
                    console.log(cm.rooms[room].id);
                    console.log(userm);
                    if(userm < cm.rooms[room].unreadCount) {
                        return " !";
                    }
                    else {
                        return "";
                    }
                }
            }
        }

        async componentDidMount() {
            //this.managechats();
            await this.getUsers();
            var c_ref = this;
            for(var user in this.state.userList) {
                if(this.state.userList[user].username !== localStorage.getItem("username")) {
                    var buttonnode = document.createElement("a");
                    buttonnode.style.padding = "0px 0px 5px 0px";
                    let roomName = [this.state.userList[user].username, localStorage.getItem('username')];
                    roomName = roomName.sort().join("_") + "_room";
                    buttonnode.id = roomName;
                    var unread = await this.chatnumber(this.state.userList[user].username);
                    if (unread !== 0){
                        buttonnode.innerHTML = this.state.userList[user].username + " " + unread;
                    } else {
                        buttonnode.innerHTML = this.state.userList[user].username;
                    }
                    this.chatnumber(this.state.userList[user].username);
                    buttonnode.onclick = function() { 
                        c_ref.changeChat(c_ref.state.chatView, this.innerHTML.split(' ')[0]);
                    }
                    document.getElementById("messageusers").appendChild(buttonnode);
                }
                //this.managechats();
            }

            var buttonnode = document.createElement("a");
            //buttonnode.id = "user_t"+user.toString();
            var unread = await this.chatnumber("General");
            buttonnode.style.padding = "0px 0px 5px 0px";
            if (unread != 0){
                buttonnode.innerHTML = "General Room" + " " + unread;
            } else {
                buttonnode.innerHTML = "General Room";
            }
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
                            {/* style={{color: "white"}} */}

                            {/* <MailIcon  style={{position: 'absolute', top: 240}} onClick={() => this.changeView(this.state.currentView)} /> */}
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