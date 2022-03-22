const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
// const knex = require("knex");
const { Client } = require("pg");

const signin = require("./controller/signin");
const register = require("./controller/register");
const img = require("./controller/img");
const profile = require("./controller/profile");

const db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

db.connect();

const app = express();

app.use(express.json());
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*")
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested, Content-Type, Accept Authorization"
//   )
//   if (req.method === "OPTIONS") {
//     res.header(
//       "Access-Control-Allow-Methods",
//       "POST, PUT, PATCH, GET, DELETE"
//     )
//     return res.status(200).json({})
//   }
//   next()
// })
app.use(cors());

app.get("/", (req, res) => res.send("workging"));
app.get("/all", (req, res) => {
  db.query("SELECT * FROM users;", (error, response) => {
    res.json(response.rows);
  });
});
app.get("/profile/:id", profile.handleProfile(db, bcrypt));
app.post("/signin", signin.handleSignIn(db, bcrypt));
app.post("/register", register.handleRegister(bcrypt));
app.put("/img", img.handleImage(db, bcrypt));

const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.put("/imgtest", (req, res) => {
  pool.query(
    "UPDATE users SET entries = entries+1 WHERE id = 6",
    (error, entries) => {
      console.log(entries);
      res.json("success");
      // if (entries.length) {
      //   console.log(entries);
      //   res.json({
      //     entries: entries.rows[0].entries,
      //   });
      // } else {
      //   res.status(400).json(`server error: ${error}`);
      // }
    }
  );
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
