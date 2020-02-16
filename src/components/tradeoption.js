import React from 'react';

class TradeOption extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (<div><button onClick = {() => window.resizeTo(400, 400)} >Accept</button><button onClick = {window.close}>Decline</button></div>);
  }
}

export default TradeOption;
