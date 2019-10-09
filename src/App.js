import React, { Component } from 'react';
import Homepage from './components/homepage';

class Home extends Component  {

  constructor(props){
    super(props);
  }

  render() {
    return(
      <div>
        <Homepage />
      </div>
      
    )
  }
}

export default Home