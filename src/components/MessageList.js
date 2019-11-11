import React, {Component} from 'react';

class MessageList extends Component {
    render() {
        return(
            <ul className="message-list">
                {this.props.messages.map((message, index) => (
                    <li key={index}>
                        {message.senderId == localStorage.getItem('username') ? 
                        (<div><h5 style={{textAlign: 'right', marginBottom: -10, fontWeight: "bold",
                        fontSize: "1em"}}>you</h5>
                        <p style={{textAlign: 'right'}}className="message-text">{message.text}</p></div>) : 
                        (<div><h5 style={{textAlign:'left', marginBottom: -10}} className="message-sender">{message.senderId}</h5>
                        <p style={{textAlign: 'left'}} className="message-text">{message.text}</p></div>)}
                        {/* <h4 className="message-sender">{message.senderId}</h4> */}
                    </li>
                ))}
                <li></li>
            </ul>
        )
    }
}
export default MessageList;