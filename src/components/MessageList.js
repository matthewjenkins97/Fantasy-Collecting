import React, {Component} from 'react';
import { View } from "react-native";

class MessageList extends Component {
    componentDidUpdate() {
        // get the messagelist container and set the scrollTop to the height of the container
        const objDiv = document.getElementById('messageList');
        objDiv.scrollTop = objDiv.scrollHeight;
      }

    render() {
        return(
            <ul className="message-list" id="messageList">
                {this.props.messages.map((message, index) => (
                    <li key={index}>
                        {message.senderId == localStorage.getItem('username') ? 
                        (<View style={{alignItems: 'flex-end'}}><h5 style={{textAlign: 'right', fontWeight: 'normal', marginBottom: -5, 
                        fontSize: "1em", color: '#b5b5b5'}}className="message-sender">you</h5>
                       <div
                       className="message-text"><div style={{textAlign: 'right', 
                       padding: '10px',  
                       elevation: 0, 
                       background: '#147efb', 
                       color: 'white',
                        borderRadius: '15px',
                        marginLeft: '50px',
                        display: 'inline-block',
                        marginBottom: -1
                        // display: 'flex',
                        // justifyContent: 'flexEnd'
                            }}>{message.text}</div></div></View>) : 
                        (<div><h5 style={{textAlign:'left', color: '#b5b5b5', fontWeight: 'normal', marginBottom: -5 }} className="message-sender">{message.senderId}</h5>
                        <div style={{textAlign: 'left', 
                        padding: '10px',  
                        elevation: 0, 
                        background: '#CCCCCC',
                        borderRadius: '15px',
                        marginRight: '50px',
                        display: 'inline-block',
                        marginBottom: -1
                        }} 
                        className="message-text">
                            {message.text}
                            </div>
                            </div>)}
                        {/* <h4 className="message-sender">{message.senderId}</h4> */}
                    </li>
                ))}
                <li></li>
            </ul>
        )
    }
}
export default MessageList;