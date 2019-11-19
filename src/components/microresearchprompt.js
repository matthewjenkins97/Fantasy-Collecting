import React from 'react';
import Button from '@material-ui/core/button';
import * as serverfuncs from '../serverfuncs';
import './gallerydropdown.css';
import FilledInput from '@material-ui/core/Input';

let buttonid = "";
let textid = "";
let divid = "";
let identifier = "";

export default class MicroresearchPrompt extends React.Component {
  constructor(props) {
    super(props);
    buttonid = this.props.identifier + "MicroresearchPromptButton";
    textid = this.props.identifier + "MicroresearchPromptText";
    divid = this.props.identifier + "MicroresearchPromptDropdown";
    identifier = this.props.identifier;
  }

  lowerTable() {
    document.getElementById(divid).style.top = "0px";
  }

  raiseTable() {
    document.getElementById(divid).style.top = "-600px";
  }

  submitMicroresearch() {
    const date = new Date();
    const data = {
      username: localStorage.getItem('username'),
      identifier: identifier,
      information: document.getElementById(textid).value,
      timestamp: date
    };

    serverfuncs.postMicroresearch(data);

    // raise table
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
              <textarea style={{width: 400, height: 300}} id={textid} multiline='true'></textarea>
            </div>
            <button onClick={this.submitMicroresearch} style={{margin:'auto', display:'block'}}>Submit</button>
          </div> 
      </div>
    ); 
  }
}