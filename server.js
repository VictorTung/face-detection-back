const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
// const knex = require("knex");
const { Client } = require('pg');

// const signin = require("./controller/signin");
const register = require("./controller/register");
// const img = require("./controller/img");
const profile = require("./controller/profile");



const db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

db.connect();


const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send('workging'));
app.get("/all", (req, res) => {

  db.query('SELECT * FROM users;', (error, response) => {
    res.json(response.rows)
  });  
});
app.post("/add", async (req, res) => {
  const { name, password, email } = req.body;
  const hash = bcrypt.hashSync(password);

  const queryText = 'INSERT INTO login(email, hash) VALUES($1,$2) RETURNING email'
  const response = await db.query(queryText, [email, hash])
  const insertuser = 'INSERT INTO users(name, email, joined) VALUES ($1, $2, $3) RETURNING *'
  const insertuserValues = [name, response.rows[0].email, new Date()]
  const user = await db.query(insertuser, insertuserValues)
  res.json(user.rows[0])
});


app.get("/profile/:id", profile.handleProfile(db, bcrypt));
// app.post("/signin", signin.handleSignIn(db, bcrypt));
app.post("/register", register.handleRegister(db, bcrypt));
// app.put("/img", img.handleImage(db, bcrypt));


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
