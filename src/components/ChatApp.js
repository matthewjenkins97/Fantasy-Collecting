import React, {Component} from 'react';
import { ChatManager, TokenProvider, ChatkitProvider } from '@pusher/chatkit-client';
import MessageList from './MessageList';
import Input from './Input';
import * as serverfuncs from "../serverfuncs";
import { default as Chatkit } from '@pusher/chatkit-server';
import sendMessageForm from "./sendMessageForm";
import { View } from "react-native";


var chatManager; 
const chatkit = new Chatkit({
    instanceLocator: "v1:us1:f04ab5ec-b8fc-49ca-bcfb-c15063c21da8",
    key: "32b71a31-bcc2-4750-9cff-59640b74814e:hQq+MMcoDqpXgMK0aPNPcm8uFHFDRmNDWcYNeiP2Zjg="
  })


class ChatApp extends Component {
    constructor(props) {
        super(props); 
        this.state = {
            currentUser: localStorage.getItem('username'),
            currentRoom: {users:[]},
            messages: [],
            users: [],
            otherUser: props.otherUser,
            created: false,
            currentRoomId: '',
            general: props.general,
        }
        this.sendMessage = this.sendMessage.bind(this);
        this.createRoom = this.createRoom.bind(this);
    }

    createRoom(roomName) {
        // console.log("CREATING ROOM")
        // console.log(this.state.currentUser)
        // console.log(typeof this.state.otherUser)
        // console.log(typeof roomName);
        chatManager
            .connect()
            .then(currentUser => {
                // console.log("NAMENAME")
                // console.log(roomName)
                // console.log(this.state.currentUser.id)
                // console.log(this.state.otherUser)
                currentUser.enablePushNotifications()
                .then(() => {
                  //console.log('Push Notifications enabled');
                })
                .catch(error => {
                  //console.error("Push Notifications error:", error);
                });
                currentUser.createRoom({
                id: roomName,
                name: roomName,
                private: true,
                addUserIds: [this.state.currentUser.id, this.state.otherUser],
                customData: { foo: 42 },
            })})
            .then(room => {
                //console.log(`Created room called ${room.name}`)
            })
            .catch(err => {
                //console.log(`Error creating room ${err}`)
          })
    } 



    checkRoom(rooms, currentRoom){
        // console.log("CHECK ROOMS");
        // console.log(currentRoom);
        for (var thing in rooms){
            // console.log(rooms[thing]);
            // console.log(rooms[thing].id);
            if (rooms[thing].id == currentRoom){
                return;
            }
        }
        this.createRoom(currentRoom);
        this.setState({ created: true })

    }


  componentDidMount() {
    let roomName = [this.state.otherUser, this.state.currentUser];
    roomName = roomName.sort().join("_") + "_room";
    if (this.state.general == "general") {
        roomName = "642a21e5-92e6-42fd-8966-b4a151d7ea94";
    }
    this.state.currentRoomId = roomName;
    // if (!this.state.created) {
    //     createRoom();
    // }
    chatManager = new ChatManager({
        instanceLocator: "v1:us1:f04ab5ec-b8fc-49ca-bcfb-c15063c21da8",
        userId: localStorage.getItem('username'),
        //userId: this.props.currentId,
        tokenProvider: new TokenProvider({
            url: "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/f04ab5ec-b8fc-49ca-bcfb-c15063c21da8/token"
        })
    })
    this.checkRoom();
    

    chatManager
            .connect()
            .then(currentUser => {
                this.checkRoom(currentUser.rooms, roomName);
                if (this.state.created) {
                    this.forceUpdate();
                }
                this.setState({ currentUser: currentUser })
                // console.log("UNREAD");
                // console.log(roomName.unreadCount);
                return currentUser.subscribeToRoom({
                    roomId: roomName,
                    messageLimit: 100,
                    hooks: {
                        onMessage: message => {
                            this.setState({
                                messages: [...this.state.messages, message],
                            })
                        },
                    }
                })     
        })
            .then(currentRoom => {
                this.setState({
                    currentRoom,
                    //users: currentRoom.userIds
                })
            })
            .catch(error => console.log(error))
    }

    sendMessage(text) {
        this.state.currentUser.sendMessage({
            roomId: this.state.currentRoomId,
            text
        })
    }


    async expandUsers(ref) {
        var userList = await serverfuncs.getAllUsers();
        return userList;
    }

    render() {
        var roomtitle = this.state.otherUser;
        if (this.state.general == "general") {
            roomtitle = "General";
        }
        var userList = this.expandUsers(this);
        const styles = {
            container: {
              height: '100vh',
              display: 'flex',
              flexDirection: 'column',
            },
            chatContainer: {
              display: 'flex',
              flex: 1,
            },
            whosOnlineListContainer: {
              width: '20px',
              flex: 'none',
              padding: 20,
              backgroundColor: '#2c303b',
              color: 'white',
            },
            chatListContainer: {
              padding: 20,
              width: '85%',
              display: 'flex',
              flexDirection: 'column',
            },
         }
         //console.log(this.state.messages.length);
                    return (
                    //   <div style={styles.container}>
                    //     <div style={styles.chatContainer}>
                    //       <aside style={styles.whosOnlineListContainer}>
                    //         <h2>Who's online PLACEHOLDER</h2>
                    //       </aside>
                    //       <section style={styles.chatListContainer}>
                    //         <h2>Chat PLACEHOLDER</h2>
                    //       </section>
                    //     </div>
                    //   </div>
                    // )
                <div className="chatapp" style={{zIndex: 99}}>
                    {/* <div> */}
                    <h3 className="header">{roomtitle}</h3>
                        <div id="messages" style={{marginTop: '17px'}}>
                            <MessageList messages={this.state.messages} style={{position: 'absolute', bottom: 0}}/>
                        </div>
                        {/* <sendMessageForm onSubmit={this.sendMessage}/> */}
                        {/* typing event: 31:35 */}
                        <Input className="input-field" onSubmit={this.sendMessage} onClick={{}} onChange={{}}/> 
                    {/* </div> */}
                    </div> )
        
    }
}
export default ChatApp;