import React from "react";
import ReactDOM from "react-dom";
//import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import * as serverfuncs from '../serverfuncs';

class TradeOption extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (<div><button onClick = {() => window.resizeTo(400, 400)} >accept</button><button onClick = {window.close}>decline</button></div>)
  }
}

export default TradeOption
