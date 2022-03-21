const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
// const knex = require("knex");
const { Client } = require('pg');

// const signin = require("./controller/signin");
// const register = require("./controller/register");
// const img = require("./controller/img");
const profile = require("./controller/profile");



const db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});



const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send('workging'));
app.get("/all", (req, res) => {
  db.connect();

  db.query('SELECT * FROM users;', (error, response) => {
    console.log(response);
    console.log(error);
    res.json(response)
  });
  
  db.end();
});
app.get("/profile/:id", profile.handleProfile(db, bcrypt));
// app.post("/signin", signin.handleSignIn(db, bcrypt));
// app.post("/register", register.handleRegister(db, bcrypt));
// app.put("/img", img.handleImage(db, bcrypt));


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
