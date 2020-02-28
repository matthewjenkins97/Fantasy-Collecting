import React from 'react';
import './imagedrop.css';
import * as serverfuncs from '../serverfuncs';

// for conversion of file names
function slugify(str) {
  const map = {
    '-': '-',
    '-': '_',
    'a': 'á|à|ã|â|À|Á|Ã|Â',
    'e': 'é|è|ê|É|È|Ê',
    'i': 'í|ì|î|Í|Ì|Î',
    'o': 'ó|ò|ô|õ|Ó|Ò|Ô|Õ',
    'u': 'ú|ù|û|ü|Ú|Ù|Û|Ü',
    'c': 'ç|Ç',
    'n': 'ñ|Ñ',
  };
  str = str.toLowerCase();
  for (const pattern in map) {
    str = str.replace(new RegExp(map[pattern], 'g'), pattern);
  };
  return str;
};

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = dt.files;
  handleFiles(files);
}

function handleFiles(files) {
  ([...files]).forEach(uploadFile);
}

function uploadFile(file) {
  const url = 'http://fantasycollecting.hamilton.edu/api/upload';
  const xhr = new XMLHttpRequest();
  const formData = new FormData();
  xhr.open('POST', url, true);

  xhr.addEventListener('readystatechange', function(e) {
    if (xhr.readyState === 4 && xhr.status === 200) {
      // console.log('IMAGE SAVED');
      document.getElementById('status').innerHTML = xhr.responseText;

      // adding prompt which allows for autocreation of artwork based on photo name
      if (window.confirm('Upload successful! Do you want to turn this photo into an artwork for the game?')) {
        // file.name - convert to all lowercase and remove the ending
        // remove illegal characters - defined as the following:
        // space, semicolon, slash, question mark, colon, at sign, equals sign, and, double qoutes, left caret, right caret, hashtag, percent sign, left brace, right brace, pipe, up caret, tilde, left square bracket, right square bracket, left parenthesis, right parenthesis, tilde
        let identifier = slugify(file.name);

        identifier = identifier.replace(/\.[^/.]+$/, '');
        identifier = identifier.replace(/[\ ;\/?:@=&\"<>#%{}|\^~\[\]\(\)`]/g, '_');
        identifier = identifier.toLowerCase();

        let url = slugify(file.name);
        url = file.name.replace(/[\ ;\/?:@=&\"<>#%{}|\^~\[\]\(\)`]/g, '_');

        // generate url
        url = 'http://fantasycollecting.hamilton.edu/static/media/' + url;

        // make artwork
        const artworkData = {
          identifier: identifier,
          url: url,
        };

        // add artwork and reload
        serverfuncs.createArtwork(artworkData);
        setTimeout( () => {
          window.location.reload();
        }, 500);
      }
    } else if (xhr.readyState === 4 && xhr.status !== 200) {
      // console.log('IMAGE UPLOAD FAILED');
      document.getElementById('status').innerHTML = 'Something went wrong. Try uploading again.';
    }
  });

  formData.append('file', file);
  xhr.send(formData);
}

class ImageDrop extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    this.setUpDrop();
    this.getAllImages();
  }

  async getAllImages() {
    const imageDisplay = document.getElementById('imagebank');
    let images = await fetch('http://fantasycollecting.hamilton.edu/api/upload');
    images = await images.json();
    // console.log(images);
    for (const i in images.photos) {
      // console.log(images.photos[i]);
      const imageNode = document.createElement('p');
      imageNode.style.backgroundImage = 'url(\'http://fantasycollecting.hamilton.edu/static/media/' + images.photos[i] + '\')';
      imageNode.style.width = '200px';
      imageNode.style.height = '200px';
      imageNode.style.backgroundSize = '100%';
      imageNode.style.objectFit = 'contain';
      imageNode.style.display = 'inline-block';
      imageNode.style.padding = '10px';
      const urlNode = document.createElement('h1');
      urlNode.innerHTML = images.photos[i];
      urlNode.style.backgroundColor = 'rgba(0, 0, 0, .5)';
      urlNode.style.borderRadius = '5px';
      urlNode.style.color = 'white';
      urlNode.style.width = '180px';
      urlNode.style.padding = '5px';

      imageNode.appendChild(urlNode);
      imageDisplay.append(imageNode);
    }
  }

  setUpDrop() {
    const dropArea = document.getElementById('drop-area');
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
      dropArea.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach((eventName) => {
      dropArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach((eventName) => {
      dropArea.addEventListener(eventName, unhighlight, false);
    });

    dropArea.addEventListener('drop', handleDrop, false);

    function highlight(e) {
      dropArea.classList.add('highlight');
    }

    function unhighlight(e) {
      dropArea.classList.remove('highlight');
    }
  }

  render() {
    return (
      <div>
        <div id='drop-area'>
          <form className='my-form'>
            <p>Upload files by dragging and dropping images onto the dashed region.</p>
            <br />
            <i id='status'></i>
          </form>
        </div>

        <div id='imagebank' style = {{padding: '10px', overflowX: 'wrap', backgroundColor: 'rgba(255, 255, 255, .9)'}}>
        </div>

      </div>
    );
  }
}

export default ImageDrop;
