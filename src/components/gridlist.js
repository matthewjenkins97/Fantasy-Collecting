import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
//import InfoIcon from '@material-ui/icons/Info';
//import tileData from './tileData';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    alignItems: 'baseline',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    //width: 1000,
    //height: 800,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
}));

const tileData = [
    {
      img: '../static/monalisa.jpg',
      title: "Mona Lisa",
      artist: 'DaVinci',
    },
    {
      img: '../static/dance.jpg',
      title: "Dance",
      artist: 'Matisse',
    },
    {
      img: '../static/sunflowers.jpg',
      title: "Sunflowers",
      artist: 'Van Gogh',
    },
];


export default function TitlebarGridList() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <GridList cellHeight={500} className={classes.gridList}>
        <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
          <ListSubheader component="div">My Gallery</ListSubheader>
        </GridListTile>
        {tileData.map(tile => (
          <GridListTile key={tile.img}>
            <img src={tile.img} alt={tile.title} />
            <GridListTileBar
              title={tile.title}
              subtitle={<span>by: {tile.artist}</span>}
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}