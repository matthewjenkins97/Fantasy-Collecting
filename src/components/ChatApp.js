import React, {Component} from 'react';
import {ChatManager, TokenProvider, ChatkitProvider} from '@pusher/chatkit-client';
import MessageList from './MessageList';
import Input from './Input';
import {setRoomCount} from './ChatMessage.js';
import * as serverfuncs from '../serverfuncs';
import {default as Chatkit} from '@pusher/chatkit-server';

let chatManager;
let chatkit;
//  = new Chatkit({
//   instanceLocator: 'v1:us1:f04ab5ec-b8fc-49ca-bcfb-c15063c21da8',
//   key: '32b71a31-bcc2-4750-9cff-59640b74814e:hQq+MMcoDqpXgMK0aPNPcm8uFHFDRmNDWcYNeiP2Zjg=',
// });


// PUBNUB

const PubNub = require('pubnub');
const clientUUID = //PubNub.generateUUID();
localStorage.getItem('UUIDpub');
//localStorage.setItem('UUIDpub', clientUUID);
const theEntry = localStorage.getItem('username');

let currentRoom = '';
let currentUser = '';

let messagesTop;
let updateText;
let sendButton;

const pubnub = new PubNub({
  publishKey: 'pub-c-a0c564ca-a14a-40b4-8d7a-a7da5c48c1cd',
  subscribeKey: 'sub-c-3efddeb4-8415-11ea-b883-d2d532c9a1bf',
  uuid: clientUUID,
});

function orderchannelname(users) {
  if(users[1] === 'General') return 'General';
  users = users.sort();
  return users.join('');
}

let cref;

// pubnub.addListener({
//   message: function(event) {
//     console.log('MESSAGE');
//     //console.log(message.message);
//     displayMessage('message', 'message');
//   },
//   presence: function() {
//     console.log('PRESENCE');
//   },
//   status: function() {
//     console.log('STATUS');
//   },
// });
// pubnub.subscribe({
//   channels: ['the_guide'],
//   withPresence: true,
// });


// const submitUpdate = function(anEntry, anUpdate) {
//   pubnub.publish({
//     channel: 'the-guide',
//     message: {'entry': anEntry, 'update': anUpdate},
//   },
//   function(status, response) {
//     if (status.error) {
//       console.log('SUBMITTED MESSAGE\n\n\n\n\n\n');
//     } else {
//       displayMessage('[PUBLISH: sent]', 'timetoken: ' + response.timetoken);
//     }
//   });
// };


const submitUpdate = function(anEntry, anUpdate) {
  pubnub.publish({
    channel: 'newchannel',
    message: {'entry': anEntry, 'update': anUpdate},
  },
  function(status, response) {
    if (status.error) {
      console.log(status);
    } else {
      //displayMessage('[PUBLISH: sent]', 'timetoken: ' + response.timetoken);
    }
  });
};

const displayMessage = function(messageType, aMessage) {
  if (typeof(messagesTop) === 'undefined') return;
  const pmessage = document.createElement('p');
  const br = document.createElement('br');
  messagesTop.after(pmessage);
  pmessage.appendChild(document.createTextNode(messageType));
  pmessage.appendChild(br);
  pmessage.appendChild(document.createTextNode(aMessage));
};

pubnub.addListener({
  message: function(msg) {
    // displayMessage('[MESSAGE: received]',
    //     event.message.entry + ': ' + event.message.update);
    console.log('message recieved');
    if (msg.message.entry === localStorage.getItem('username')||
        msg.message.entry === currentUser) {
      addToMessages(cref, currentRoom, {entry: msg.message});
    }
  },
  presence: function(event) {
    // displayMessage('[PRESENCE: ' + event.action + ']',
    //     'uuid: ' + event.uuid + ', channel: ' + event.channel);
  },
  status: function(event) {
    // displayMessage('[STATUS: ' + event.category + ']',
    //     'connected to channels: ' + event.affectedChannels);

    // if (event.category == 'PNConnectedCategory') {
    //   submitUpdate(theEntry, 'Harmless.');
    // }
  }});


subscribeToPubChannels();
async function subscribeToPubChannels() {
  console.log('USERNAME');
  console.log(localStorage.getItem('username'));
  const users = await serverfuncs.getAllUsers();
  const usernames = [];
  for (let i in users) {
    usernames.push(orderchannelname([localStorage.getItem('username'), users[i].username]));
  }
  console.log('SUBSCRIBING');
  console.log(usernames);
  pubnub.subscribe({
    channels: usernames,
    withPresence: true,
  });
}


async function initializemessages(cref, userchannel, newmessage) {
  console.log('Initializing messages!!!');
  console.log('USER CHANNEL: '+userchannel);
  pubnub.history({
    channel: userchannel,
  }).then((response)=> {
    cref.state.messages = response.messages;
    console.log(cref.state.messages);
    if (typeof(newmessage) !== 'undefined') {
      cref.state.messages.push(newmessage);
    }
    console.log(cref.state.messages);
    console.log('FORCED UPDATE\n\n\n\n\n');
    cref.forceUpdate();
  }).catch((error)=> {
    console.log('ERROR');
    console.log(error);
  });
  cref.state.currentRoom = userchannel;
}


function addToMessages(cref, userchannel, newmessage) {
    cref.state.messages.push(newmessage);
    cref.forceUpdate();
}


// async function initializemessages() {
//   pubnub.history(
//       {
//         channel: 'the-guide',
//         count: 10,
//       },
//       function(status, response) {
//         console.log(response.messages);
//         console.log(response.startTimeToken);
//         console.log(response.endTimeToken);
//         for (let i = 0; i < response.messages.length; i++) {
//           console.log(response.messages[i].entry);
//           displayMessage('[History]: \n',
//               response.messages[i].entry.update);
//         }
//       }
//   );
// }

// async function pub() {
//   for (let i = 0; i < 100; i++) {
//     await pubnub.publish( {
//       channel: 'the-guide',
//       message: 'message : ' + i,
//     } );
//   }
// }


// END PUBNUB


class ChatApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: localStorage.getItem('username'),
      currentRoom: '',
      messages: [],
      users: [],
      otherUser: props.otherUser,
      created: false,
      currentRoomId: '',
      general: props.general,
    };
    // this.sendMessage = this.sendMessage.bind(this);
    // this.createRoom = this.createRoom.bind(this);
  }

  createRoom(roomName) {
    // console.log('CREATING ROOM')
    // console.log(this.state.currentUser)
    // console.log(typeof this.state.otherUser)
    // console.log(typeof roomName);
    chatManager
        .connect()
        .then((currentUser) => {
          // console.log('NAMENAME')
          // console.log(roomName)
          // console.log(this.state.currentUser.id)
          // console.log(this.state.otherUser)
          currentUser.enablePushNotifications()
              .then(() => {
                // console.log('Push Notifications enabled');
              })
              .catch((error) => {
                // console.error('Push Notifications error:', error);
              });
          currentUser.createRoom({
            id: roomName,
            name: roomName,
            private: true,
            addUserIds: [this.state.currentUser.id, this.state.otherUser],
          });
        })
        .then((room) => {
          // console.log(`Created room called ${room.name}`)
        })
        .catch((err) => {
          // console.log(`Error creating room ${err}`)
        });
  }

  checkRoom(rooms, currentRoom) {
    for (const thing in rooms) {
      if (rooms[thing].id == currentRoom) {
        return;
      }
    }
    //this.createRoom(currentRoom);
    this.setState({created: true});
  }

  displayMessage(messageType, aMessage) {
    initializemessages(this, currentRoom);
  }

  async componentDidMount() {
    // PUBNUB
    cref = this;
    console.log('MOUNTED');
    messagesTop = document.getElementById('messages-top');
    updateText = document.getElementById('update-text');
    sendButton = document.getElementById('publish-button');
    // sendButton.addEventListener('click', () => {
    //   submitUpdate(theEntry, updateText.value);
    // });
    console.log(this.otherUser);
    initializemessages(this, orderchannelname([localStorage.getItem('username'), this.state.otherUser]));

    // let roomName = [this.state.otherUser, this.state.currentUser];
    // roomName = roomName.sort().join('_') + '_room';
    // if (this.state.general == 'general') {
    //   roomName = '642a21e5-92e6-42fd-8966-b4a151d7ea94';
    // }
    // this.state.currentRoomId = roomName;
    // chatManager = new ChatManager({
    //   instanceLocator: 'v1:us1:f04ab5ec-b8fc-49ca-bcfb-c15063c21da8',
    //   userId: localStorage.getItem('username'),
    //   tokenProvider: new TokenProvider({
    //     url: 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/f04ab5ec-b8fc-49ca-bcfb-c15063c21da8/token',
    //   }),
    // });

    // chatManager.connect().then((currentUser) => {
    //   this.checkRoom(currentUser.rooms, roomName);
    //   if (this.state.created) {
    //     this.forceUpdate();
    //   }
    //   this.setState({currentUser: currentUser});
    //   // console.log('UNREAD');
    //   // console.log(roomName.unreadCount);
    //   return currentUser.subscribeToRoom({
    //     roomId: roomName,
    //     messageLimit: 100,
    //     hooks: {
    //       onMessage: (message) => {
    //         this.setState({
    //           messages: [...this.state.messages, message],
    //         });
    //       },
    //     },
    //   });
    // }).then((currentRoom) => {
    //   this.setState({
    //     currentRoom,
    //   });
    // }).catch((error) => console.log(error));
  }

  async sendMessage(text) {
    console.log(cref.state.currentRoom);
    pubnub.publish({
      channel: 'admindholley',//cref.state.currentRoom,
      message: {'entry': localStorage.getItem('username'), 'update': text},
    },
    function(status, response) {
      if (status.error) {
        console.log(status);
      } else {
        //displayMessage('[PUBLISH: sent]', 'timetoken: ' + response.timetoken);
      }
    });
    // await this.state.currentUser.sendMessage({
    //   roomId: this.state.currentRoomId,
    //   text,
    // });
    // setRoomCount(this.state.currentRoomId, this.state.messages.length+1);
  }

  async expandUsers(ref) {
    const userList = await serverfuncs.getAllUsers();
    return userList;
  }

  render() {
    let roomtitle = this.state.otherUser;
    if (this.state.general == 'general') {
      roomtitle = 'General';
    }
    const userList = this.expandUsers(this);
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
    currentRoom = this.state.currentRoom;
    currentUser = this.state.otherUser;
    return (
      <div>
        <div className='chatapp' style={{zIndex: 99}}>
          <h3 className='header'>{roomtitle}</h3>
          <div id='messages' style={{marginTop: '17px'}}>
            <MessageList messages={this.state.messages} style={{position: 'absolute', bottom: 0}}/>
          </div>
          <Input className='input-field' onSubmit={this.sendMessage} onClick={{}} onChange={{}}/>
        </div>
      </div>);
  }
}

export default ChatApp;
