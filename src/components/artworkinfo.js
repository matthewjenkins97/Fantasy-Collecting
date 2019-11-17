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
        <div>
          <Typography><b>Title</b>: Mona Lisa</Typography>
          <Typography><b>Artist</b>: Leonardo Da Vinci</Typography>
          <Typography><b>Year</b>: 1512</Typography>
          <Typography><b>Current Selling Price</b>: 50</Typography>
          <Button><i>Show History</i></Button>
          <Button><i>Show Microresearch</i></Button>
        </div>
      </Card>
    </div>
  }
}