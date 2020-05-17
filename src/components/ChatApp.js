import React, {Component} from 'react';
import {ChatManager, TokenProvider, ChatkitProvider} from '@pusher/chatkit-client';
import MessageList from './MessageList';
import Input from './Input';
import {setRoomCount} from './ChatMessage.js';
import * as serverfuncs from '../serverfuncs';
import {default as Chatkit} from '@pusher/chatkit-server';

export {setUpUUID, getlastmessagetimestamp, unsubpub};

let chatManager;

// PUBNUB

const PubNub = require('pubnub');
let clientUUID;
const theEntry = localStorage.getItem('username');

let currentRoom = '';
let currentUser = '';

let pubnub;

function unsubpub() {
  pubnub.unsubscribeAll();
}

async function getlastmessagetimestamp(id) {
  let ts;
  await pubnub.history({
    channel: id,
    count: 1,
  }).then((messages)=> {
    if (messages.messages.length === 0) {
      ts = 0;
    } else {
      ts = messages.messages[0].entry.time;
    }
  }).catch((error)=> {
    ts = -1;
  });
  return ts;
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
  // try{
    useruuid = useruuid[0].uuid;
  // }
  // catch{
  //   useruuid = null;
  // }

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
      console.log("message recieved");
      if (msg.message.entry === localStorage.getItem('username')||
          msg.message.entry === currentUser||
          msg.message.room === 'General') {
        addToMessages(cref, currentRoom, {entry: msg.message});
        updateMessageCount(msg.message.time, currentRoom);
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
  });
}

async function updateMessageCount(ts, room) {
  console.log(room);
  if (typeof ts === 'undefined' || ts === null) return;
  let mroomcount = await fetch('http://fantasycollecting.hamilton.edu/api/messages/'+localStorage.getItem('username')+'/'+room);
  mroomcount = await mroomcount.json();
  if (mroomcount.length === 0) {
    await fetch('http://fantasycollecting.hamilton.edu/api/messages/', {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: localStorage.getItem('username'),
        room: room,
        messagecount: ts,
      }),
    });
  } else {
    console.log('updating message count for room '+room);
    fetch('http://fantasycollecting.hamilton.edu/api/messages/'+localStorage.getItem('username')+'/'+room, {
      method: 'put',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messagecount: ts,
      }),
    }).then(function(res) {
    });
  }
}


async function subscribeToPubChannels() {
  const users = await serverfuncs.getAllUsers();
  const usernames = ['General'];
  for (let i in users) {
    usernames.push(orderchannelname([localStorage.getItem('username'), users[i].username]));
  }
  pubnub.subscribe({
    channels: usernames,
    withPresence: true,
  });
  console.log('subscribed to channels');
}


async function initializemessages(cref, userchannel, newmessage) {
  pubnub.history({
    channel: userchannel,
  }).then((response)=> {
    cref.state.messages = response.messages;
    if (typeof(newmessage) !== 'undefined') {
      cref.state.messages.push(newmessage);
    }
    console.log('time');
    console.log(cref.state.messages[cref.state.messages.length-1].entry.time);
    updateMessageCount(cref.state.messages[cref.state.messages.length-1].entry.time, userchannel);
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
    const sendmessage = {'entry': localStorage.getItem('username'), 'update': text, 'time': Date.now(), 'room':cref.state.currentRoom};
    console.log(sendmessage);
    pubnub.publish({
      channel: cref.state.currentRoom,
      message: sendmessage,
    },
    function(status, response) {
      if (status.error) {
        console.log(status);
      } else {
        updateMessageCount(sendmessage.time, cref.state.currentRoom);
      }
    });
  }


  async expandUsers(ref) {
    const userList = await serverfuncs.getAllUsers();
    return userList;
  }

  render() {
    let roomtitle = this.state.otherUser;
    if (this.state.general == 'General') {
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
