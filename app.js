import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { bodyParser } from "body-parser";
import mysql from 'mysql'

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static("dist"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.post("/api/register", (req, res) => {
  let data = req.body;
  res.send("hello api post :) + ", JSON.stringify(data));
});
// Start the server
app.listen(8080, () => {
  console.log("Server started on port 8080");
});

// NOTES
//in order to run the backend server, run node app.js
//in the terminal
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  port: 4040,
  password: '02171110'
})

connection.connect()

connection.query('SELECT 1 + 1 AS solution', (err, rows, fields) => {
  if (err) console.log(err)

  console.log('The solution is: ', rows[0].solution)
})

connection.end()