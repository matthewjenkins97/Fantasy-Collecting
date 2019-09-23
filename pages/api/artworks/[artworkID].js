export default (req, res) => {
  const {
    query: {artworkID},
  } = req;

  res.end(`Post: ${artworkID}`);
};
