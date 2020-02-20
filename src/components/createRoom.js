import React, {Component} from 'react';
import {ChatManager, TokenProvider, ChatkitProvider} from '@pusher/chatkit-client';
import MessageList from './MessageList';
import Input from './Input';
import * as serverfuncs from '../serverfuncs';
import {default as Chatkit} from '@pusher/chatkit-server';

let chatManager;
const chatkit = new Chatkit({
  instanceLocator: 'v1:us1:f04ab5ec-b8fc-49ca-bcfb-c15063c21da8',
  key: '32b71a31-bcc2-4750-9cff-59640b74814e:hQq+MMcoDqpXgMK0aPNPcm8uFHFDRmNDWcYNeiP2Zjg=',
});


class ChatApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: localStorage.getItem('username'),
      currentRoom: {users: []},
      messages: [],
      users: [],
      otherUser: props.otherUser,
      created: false,
      currentRoomId: '',
      general: props.general,
    };
    this.sendMessage = this.sendMessage.bind(this);
  }

  checkRoom(rooms, currentRoom) {
    // console.log('CHECK ROOMS');
    // console.log(currentRoom);
    for (const thing in rooms) {
      // console.log(rooms[thing]);
      // console.log(rooms[thing].id);
      if (rooms[thing].id == currentRoom) {
        return;
      }
    }
  }


  componentDidMount() {
    // console.log('ROOOOOOONS');
    // console.log(this.state.currentUser.rooms);
    // console.log(this.state.otherUser);
    // console.log(this.state.currentUser);
    let roomName = [this.state.otherUser, this.state.currentUser];
    roomName = roomName.sort().join('_') + '_room';
    if (this.state.general == 'general') {
      roomName = '642a21e5-92e6-42fd-8966-b4a151d7ea94';
    }
    this.setState({
      currentRoomId: roomName,
    });
    // if (!this.state.created) {
    //     createRoom();
    // }
    chatManager = new ChatManager({
      instanceLocator: 'v1:us1:f04ab5ec-b8fc-49ca-bcfb-c15063c21da8',
      userId: localStorage.getItem('username'),
      tokenProvider: new TokenProvider({
        url: 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/f04ab5ec-b8fc-49ca-bcfb-c15063c21da8/token',
      }),
    });
    this.checkRoom();

    chatManager.connect()
        // .then(currentUser => {
        //                 currentUser.createRoom({
        //                 id: this.state.currentRoomId,
        //                 name: this.state.currentRoomId,
        //                 private: true,
        //                 addUserIds: [this.state.currentUser, this.state.otherUser],
        //                 customData: { foo: 42 },
        //             })
        //             console.log('******')
        //             console.log(roomName)
        //             .then(room => {
        //                 console.log(`Created room called ${room.name}`)
        //             })
        //             .catch(err => {
        //                 console.log(`Error creating room ${err}`)
        //           })
        // })
        .then((currentUser) => {
          // console.log(currentUser.rooms);
          this.setState({currentUser: currentUser});
          return currentUser.subscribeToRoom({
            roomId: roomName,
            messageLimit: 100,
            hooks: {
              onMessage: (message) => {
                this.setState({
                  messages: [...this.state.messages, message],
                });
              },
            },
          });
        })
        .then((currentRoom) => {
          this.setState({
            currentRoom,
          });
        })
        .catch((error) => console.log(error));
  }

  sendMessage(text) {
    // console.log('SEND MESSAGE');
    // console.log(this.state.currentUser);
    this.state.currentUser.sendMessage({
      roomId: this.state.currentRoomId,
      text,
    });
  }


  async expandUsers(ref) {
    const userList = await serverfuncs.getAllUsers();
    return userList;
  }

  render() {
    const userList = this.expandUsers(this);
    // for (let user in userList){
    //     console.log(user);
    // }
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
    };
    return (
      <div className='chatapp'>
        <div>
          {/* <h2 className='header'>General Room</h2> */}
          <div id='messages'>
            <MessageList messages={this.state.messages} style={{position: 'absolute', bottom: 0, marginBottom: 50}}/>
          </div>
          {/* <sendMessageForm onSubmit={this.sendMessage}/> */}
          {/* typing event: 31:35 */}
          <Input className='input-field' onSubmit={this.sendMessage} onClick={{}} onChange={{}}/>
        </div>
      </div> );
  }
}
export default ChatApp;
