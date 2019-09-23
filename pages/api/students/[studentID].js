export default (req, res) => {
  const {
    query: {studentID},
  } = req;

  res.end(JSON.stringify({'studentID': studentID}));
};
