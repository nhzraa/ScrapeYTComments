const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'movies'
});

connection.connect(function(err) {
  if (err) {
    return console.error('error: ' + err.message);
  }
 
  console.log('Connected to the MySQL server.');
});

/*connection.query('SELECT * FROM movies', (err,rows) => {
  if(err) throw err;
  console.log('Data received from Db:\n');
  console.log(rows);
});*/

module.exports = connection;
