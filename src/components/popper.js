import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Popper from '@material-ui/core/Popper';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
  },

}));

export default function SimplePopper(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? props.identifier + '-simple-popper' : undefined;

  return (
    <div>
      <Button aria-describedby={id} onClick={handleClick} style={{fontStyle: 'italic'}}>
        Microresearch
      </Button>
      <Popper id={id} open={open} anchorEl={anchorEl} transition>
        {({TransitionProps}) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper style={{width: 500}}>

            </Paper>
          </Fade>
        )}
      </Popper>
    </div>
  );
}
