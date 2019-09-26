import * as artworkDB from '../../../db/artworks.json';

export default (req, res) => {
  const {
    query: {artworkID},
  } = req;

  // Checking if artworkID is valid.
  if (artworkID in artworkDB.artworks) {
    if (req.method === 'GET') {
      // Get data from your database
      const artwork = artworkDB.artworks[artworkID];
      res.status(200).json(artwork);
    } else if (req.method === 'PUT') {
      // Update or create data in your database
      res.status(200).end(`Method ${method} received`);
    } else if (req.method === 'POST') {
      // Create data in your database
      res.status(200).end(`Method ${method} received`);
    } else if (req.method === 'DELETE') {
      // Delete data from your database
      res.status(200).end(`Method ${method} received`);
    } else {
      // from next.js
      res.setHeader('Allow', ['GET', 'PUT', 'POST', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  } else {
    res.status(404).end(`Artwork ID ${artworkID} not found in Database.`);
  }
};
