import React from 'react';
import Button from '@material-ui/core/button';
import * as serverfuncs from '../serverfuncs';
import './gallerydropdown.css';

export default class MicroresearchPrompt extends React.Component {
  constructor(props) {
    super(props);

    // needs to be done for divid to be preserved
    this.lowerTable = this.lowerTable.bind(this)
    this.raiseTable = this.raiseTable.bind(this)
    this.submitMicroresearch = this.submitMicroresearch.bind(this)
    this.render = this.render.bind(this);

    this.textid = this.props.identifier + "MicroresearchPromptText";
    this.divid = this.props.identifier + "MicroresearchPromptDropdown";
    this.identifier = this.props.identifier;
  }

  lowerTable() {
    document.getElementById(this.divid).style.top = "50px";
  }

  raiseTable() {
    document.getElementById(this.divid).style.top = "-600px";
  }

  submitMicroresearch() {
    const data = {
      username: localStorage.getItem('username'),
      identifier: this.identifier,
      information: document.getElementById(this.textid).value,
      timestamp: new Date()
    };

    serverfuncs.postMicroresearch(data);

    // raise table
    document.getElementById(this.divid).style.top = "-600px";

    // refresh
    setTimeout( () => { window.location.reload() }, 500);
  }

  render() {
    const title = "Add Microresearch for \"" + this.identifier + "\"";
    return (
      <div>
        <Button onClick={this.lowerTable}><i>Add Microresearch...</i></Button>
          <div id={this.divid} class="galleryDropdown">
            <a class="closebtn" onClick={this.raiseTable}>&times;</a>
            <p>&nbsp;</p>
            <div style={{textAlign: 'center'}}>
              <h1>{title}</h1>
              <textarea style={{width: 400, height: 300}} id={this.textid} multiline='true'></textarea>
            </div>
            <button onClick={this.submitMicroresearch} style={{margin:'auto', display:'block'}}>Submit</button>
          </div> 
      </div>
    ); 
  }
}