import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';

export default class ArtworkInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div>
      <Card raised='true' style={{width: '50%', height: '35%'}}>
        <div style={{float: 'left', width: '50%'}}>
          <img style={{width: '85%', height: '85%'}} src={require("../static/monalisa.jpg")}/>
        </div>
        <div style={{float: 'right', width: '50%'}}>
          <Typography><b>Title</b>: Mona Lisa</Typography>
          <Typography><b>Artist</b>: Leonardo Da Vinci</Typography>
          <Typography><b>Year</b>: 1512</Typography>
          <Typography><b>Current Selling Price</b>: 50</Typography>
          <Button>Show History</Button>
        </div>
      </Card>
    </div>
  }
}