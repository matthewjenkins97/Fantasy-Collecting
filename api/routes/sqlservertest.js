const mysql = require('mysql2');

function changeText() {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'test',
    password: 'password',
  });
  connection.query(
      "SELECT title FROM artworks WHERE ident = 'MONALISA'",
      function(err, results, fields) {
        console.log(results); // results contains rows returned by server
      }
  );
  connection.end();
}
