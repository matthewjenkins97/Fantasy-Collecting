import * as studentDB from '../../db/students.json';

export default (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.end(JSON.stringify(studentDB));
};
