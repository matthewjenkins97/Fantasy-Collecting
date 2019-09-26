import * as studentDB from '../../../db/students.json';

export default (req, res) => {
  const {
    query: {studentID},
  } = req;

  // Checking if studentID is valid.
  if (studentID in studentDB.students) {
    if (req.method === 'GET') {
      // Get data from your database
      res.status(200).json(studentDB.students[studentID]);
    } else if (req.method === 'PUT') {
      // Update or create data in your database
      res.status(200).end(`Method ${method} received`);
    } else if (req.method === 'POST') {
      // Create data in your database
      res.status(201).end(`Method ${method} received`);
    } else if (req.method === 'DELETE') {
      // Delete data from your database
      res.status(200).end();
    } else {
      // only the ones mentioned are allowed.
      res.setHeader('Allow', ['GET', 'PUT', 'POST', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  } else {
    res.status(404).end(`Student ID ${studentID} not found in Database.`);
  }
};
