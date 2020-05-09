import React, {Component} from 'react';
import {ChatManager, TokenProvider, ChatkitProvider} from '@pusher/chatkit-client';
import MessageList from './MessageList';
import Input from './Input';
import {setRoomCount} from './ChatMessage.js';
import * as serverfuncs from '../serverfuncs';
import {default as Chatkit} from '@pusher/chatkit-server';

export {setUpUUID, getlastmessagetimestamp};

let chatManager;

// PUBNUB

const PubNub = require('pubnub');
let clientUUID;
const theEntry = localStorage.getItem('username');

let currentRoom = '';
let currentUser = '';

let pubnub;

async function getlastmessagetimestamp(roomName) {
  // await pubnub.history({
  //   channel: userchannel,
  //   count: 1,
  // }).then((messages)=> {
  //   if (messages.Length === 0) {
  //     return 0;
  //   } else {
  //     return messages[0].entry.time;
  //   }
  // }).catch((error)=> {
  // });
}

function orderchannelname(users) {
  if (users[1] === 'General') return 'General';
  users = users.sort();
  return users.join('');
}

let cref;

async function setUpUUID() {
  let useruuid = await fetch('http://fantasycollecting.hamilton.edu/api/users/'+localStorage.getItem('username'));
  useruuid = await useruuid.json();
  useruuid = useruuid[0].uuid;

  localStorage.setItem('UUIDpub', useruuid);

  if (localStorage.getItem('UUIDpub') === null || typeof(localStorage.getItem('UUIDpub') === 'undefined')) {
    clientUUID = PubNub.generateUUID();
    setUserUUID();
  } else {
    clientUUID = localStorage.getItem('UUIDpub');
  }
  pubnub = new PubNub({
    publishKey: 'pub-c-a0c564ca-a14a-40b4-8d7a-a7da5c48c1cd',
    subscribeKey: 'sub-c-3efddeb4-8415-11ea-b883-d2d532c9a1bf',
    uuid: clientUUID,
  });
  pubnub.addListener({
    message: function(msg) {
      console.log('message recieved');
      if (msg.message.entry === localStorage.getItem('username')||
          msg.message.entry === currentUser) {
        addToMessages(cref, currentRoom, {entry: msg.message});
      }
    },
    presence: function(event) {
    },
    status: function(event) {
    }});
  subscribeToPubChannels();
}

function setUserUUID() {
  fetch('http://fantasycollecting.hamilton.edu/api/users/'+localStorage.getItem('username'), {
    method: 'put',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      uuid: clientUUID,
    }),
  }).then(function (res) {
    console.log(res);
  });
}

function updateMessageCount(ts) {
  // fetch('http://fantasycollecting.hamilton.edu/api/messages/'+localStorage.getItem('username')+'/'+currentRoom, {
  //   method: 'put',
  //   mode: 'cors',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     count: ts,
  //   }),
  // }).then(function(res){console.log(res);});
}


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
  pubnub.history({
    channel: userchannel,
  }).then((response)=> {
    cref.state.messages = response.messages;
    if (typeof(newmessage) !== 'undefined') {
      cref.state.messages.push(newmessage);
    }
    cref.forceUpdate();
  }).catch((error)=> {
  });
  cref.state.currentRoom = userchannel;
}


function addToMessages(cref, userchannel, newmessage) {
  cref.state.messages.push(newmessage);
  cref.forceUpdate();
}


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

  checkRoom(rooms, currentRoom) {
    for (const thing in rooms) {
      if (rooms[thing].id == currentRoom) {
        return;
      }
    }
    this.setState({created: true});
  }

  displayMessage(messageType, aMessage) {
    initializemessages(this, currentRoom);
  }

  async componentDidMount() {
    // PUBNUB
    cref = this;
    initializemessages(this, orderchannelname([localStorage.getItem('username'), this.state.otherUser]));
  }

  async sendMessage(text) {
    const sendmessage = {'entry': localStorage.getItem('username'), 'update': text, 'time': Date.now()};
    console.log(cref.state.currentRoom);
    pubnub.publish({
      channel: cref.state.currentRoom,
      message: sendmessage,
    },
    function(status, response) {
      if (status.error) {
        console.log(status);
      } else {
        updateMessageCount(sendmessage.time);
      }
    });
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
