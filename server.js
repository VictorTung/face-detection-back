const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
// const knex = require("knex");
const { Client } = require("pg");
const { Pool } = require("pg");

const signin = require("./controller/signin");
const register = require("./controller/register");
const img = require("./controller/img");
const profile = require("./controller/profile");

const PORT = process.env.PORT || 3001;

const db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

db.connect();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send("workging"));
app.get("/all", (req, res) => {
  db.query("SELECT * FROM users;", (error, response) => {
    res.json(response.rows);
  });
});
app.get("/profile/:id", profile.handleProfile(db));
app.post("/signin", signin.handleSignIn(db, bcrypt));
app.post("/register", register.handleRegister(pool, bcrypt));
app.put("/img", img.handleImage(pool, bcrypt));

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
