

const http = require('http'),
  path = require('path'),
  express = require('express'),
  bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(express.static('.'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const db = new sqlite3.Database(':memory:');
db.serialize(function () {
  db.run("CREATE TABLE user (username TEXT, password TEXT, title TEXT)");
  db.run("INSERT INTO user VALUES ('privilegedUser', 'privilegedUser1', 'Administrator')");
});

// GET route to send HTML file to the browser
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// POST route to handle login form submissions
app.post('/login', (req, res) => {
  // Get username and password from req.body
  const { username, password } = req.body;

// Create SQL query (Note: This is intentionally vulnerable to SQL injection)
const query = `SELECT title FROM user WHERE username = '${username}' AND password = '${password}'`;

// Log username, password, and SQL query
console.log('Username:', username);
console.log('Password:', password);
console.log('SQL Query:', query);

// Run a SQLite method to verify login
// Assume this is within an Express route handler
db.get(query, function (err, row) {
    if (err) {
      console.log('ERROR', err);
      res.redirect("/index.html#error");
    } else if (!row) {
      res.redirect("/index.html#unauthorized");
    } else {
      res.send(`Hello <b>${row.title}</b><br />
        This file contains all your secret data: <br /><br />
        SECRETS <br /><br />
        MORE SECRETS <br /><br />
        <a href="/index.html">Go back to login</a>`);
    }
  });
  
  // This code assumes you have already defined your Express app
  // and you are choosing a port to listen on
  const port = 3000;
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
  