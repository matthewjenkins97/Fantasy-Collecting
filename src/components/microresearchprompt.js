import React from 'react';
import Button from '@material-ui/core/button';
import * as serverfuncs from '../serverfuncs';
import './gallerydropdown.css';
import FilledInput from '@material-ui/core/Input';

var buttonid = "";
var divid = "";
var identifier = "";

export default class MicroresearchPrompt extends React.Component {
  constructor(props) {
    super(props);
    buttonid = this.props.identifier + "MicroresearchPromptButton";
    divid = this.props.identifier + "MicroresearchPromptDropdown";
    identifier = this.props.identifier;
  }

  lowerTable() {
    document.getElementById(divid).style.top = "0px";
  }

  raiseTable() {
    document.getElementById(divid).style.top = "-600px";
  }

  render() {
    return (
      <div>
        <Button id={buttonid} onClick={this.lowerTable}><i>Add Microresearch</i></Button>
          <div id={divid} class="galleryDropdown">
            <a class="closebtn" onClick={this.raiseTable}>&times;</a>
            <p>&nbsp;</p>
            <div style={{textAlign: 'center'}}>
              <h1>Add Microresearch for "{identifier}"</h1>
              <FilledInput multiline='true'></FilledInput>
              <Button style={{position: 'absolute', top: '50%'}}>Submit</Button>
            </div>
          </div> 
      </div>
    ); 
  }
}