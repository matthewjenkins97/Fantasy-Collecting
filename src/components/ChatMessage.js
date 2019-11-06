import React, { Component } from 'react';
import ChatApp from './ChatApp.js';
import MailIcon from '@material-ui/icons/Mail';
import { default as Chatkit } from '@pusher/chatkit-server';

const chatkit = new Chatkit({
  instanceLocator: "v1:us1:f04ab5ec-b8fc-49ca-bcfb-c15063c21da8",
  key: "32b71a31-bcc2-4750-9cff-59640b74814e:hQq+MMcoDqpXgMK0aPNPcm8uFHFDRmNDWcYNeiP2Zjg="
})


class ChatMessage extends Component {
        constructor(props) {
            super(props);
            this.state = {
                currentView: false
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
        render() {
            return (
                <div>
                    {/* style={{color: "white"}} */}
                    <MailIcon  onClick={() => this.changeView(this.state.currentView)} />
                    { this.state.currentView ? (<div className="App"><div className="form-container">
                <ChatApp />
            </div></div>) : (null) }
                </div>
            )
        }
    }
export default ChatMessage;