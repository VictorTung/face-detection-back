const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
// const knex = require("knex");
const { Client } = require('pg');

const signin = require("./controller/signin");
const register = require("./controller/register");
const img = require("./controller/img");
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
app.get("/profile/:id", profile.handleProfile(db, bcrypt));
app.post("/signin", signin.handleSignIn(db, bcrypt));
app.post("/register", register.handleRegister(bcrypt));
app.put("/img", img.handleImage(db, bcrypt));
app.put("/imgtest", (req, res)=>{
  db.query('UPDATE users SET entries = 1 WHERE id = $1 RETURNING entries;', [6], (error, entries) => {
    if (entries.length) {
      console.log(entries);
      res.json({
        entries: entries.rows[0].entries,
      });
    } else {
      res.status(400).json(`server error: ${error}`);
    }
  });  
});


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
