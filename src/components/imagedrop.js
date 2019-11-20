import React from "react";
import "./imagedrop.css"
import * as serverfuncs from '../serverfuncs';

function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}

function handleDrop(e) {
  let dt = e.dataTransfer
  let files = dt.files

  handleFiles(files)
}

function handleFiles(files) {
  ([...files]).forEach(uploadFile)
}


function uploadFile(file) {
  var url = '../static/.'
  var xhr = new XMLHttpRequest()
  var formData = new FormData()
  xhr.open('POST', url, true)

  xhr.addEventListener('readystatechange', function(e) {
    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log("IMAGE SAVED");
    }
    else if (xhr.readyState === 4 && xhr.status !== 200) {
      console.log("IMAGE UPLOAD FAILED");
    }
  })

  formData.append('file', file)
  xhr.send(formData)
}


class ImageDrop extends React.Component{
    constructor(props) {
      super(props);
    }

    componentDidMount() {
      this.setUpDrop();
    }

    setUpDrop() {
      let dropArea = document.getElementById('drop-area');
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false)
      })

      ;['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false)
      })
      
      ;['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false)
      })

      dropArea.addEventListener('drop', handleDrop, false)

      function highlight(e) {
        dropArea.classList.add('highlight')
      }
      
      function unhighlight(e) {
        dropArea.classList.remove('highlight')
      }

    }

    render(){
      return (
        <div id="drop-area">
          <form class="my-form">
            <p>Upload multiple files with the file dialog or by dragging and dropping images onto the dashed region</p>
            <input type="file" id="fileElem" multiple accept="image/*" onchange="handleFiles(this.files)"/>
            <label class="button" for="fileElem">Select some files</label>
          </form>
        </div>
      );
    }
}

export default ImageDrop;
