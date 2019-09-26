import React, { Component } from "react";
import StackGrid from "react-stack-grid";

class MyComponent extends Component {
  render() {
    return (
      <StackGrid
        columnWidth={150}
      >
       <img src="../static/monalisa.jpg" height={500}/>
        <img src="../static/dance.jpg" height={500} />
        <img src="../static/sunflowers.jpg" height={500}/>
      </StackGrid>
    );
  }
}

export default MyComponent;
