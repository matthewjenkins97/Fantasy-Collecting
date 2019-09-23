import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Nav from '../components/nav';
import SimpleMenu from '../components/menu';
import Grid from '@material-ui/core/Grid';
import MediaCard from '../components/card';
import GridList from '../components/gridlist';
//import MonaLisa from '../static/monalisa.jpg;

const Home = () => (
  // <Grid
  // container
  // direction="row"
  // justify="center"
  // alignItems="center"
  // spacing={12}
  // >
  <div>
    <div>
      <SimpleMenu />
    </div>
    <GridList />
    <div>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
      >
          <MediaCard 
          title="Mona Lisa" 
          description="The Mona Lisa - 
          by Leonardo Da Vinci. Mona Lisa, also known as La Gioconda, 
          is the wife of Francesco del Giocondo. This painting is painted 
          as oil on wood. The original painting size is 77 x 53 cm (30 x 20 7/8 in) 
          and is owned by by the Government of France and is on the wall in the 
          Louvre in Paris, France."
          image="../static/monalisa.jpg"
          />
          <MediaCard 
          title="Dance" 
          description="Dance is a painting made by Henri Matisse in 1910, 
          at the request of Russian businessman and art collector Sergei Shchukin, 
          who bequeathed the large decorative panel to the Hermitage Museum in Saint 
          Petersburg, Russia."
          image="../static/dance.jpg"
          />
          <MediaCard 
          title="Sunflowers" 
          description="Sunflowers is the name of two series of still life paintings by 
          the Dutch painter Vincent van Gogh. The first series, executed in Paris in 1887, 
          depicts the flowers lying on the ground, while the second set, executed a year later in Arles, shows a bouquet of sunflowers in a vase."
          image="../static/sunflowers.jpg"
          />

        {/* <img src="/static/monalisa.jpg" alt="my image" /> */}
      </Grid>
    </div>
  </div>
)

export default Home