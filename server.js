const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const signin = require("./controller/signin");
const register = require("./controller/register");
const img = require("./controller/img");
const profile = require("./controller/profile");

// My PC
// const db = knex({
//   client: "pg",
//   connection: {
//     host: "127.0.0.1",
//     port: 5432,
//     user: "postgres",
//     password: "password",
//     database: "smart-brain",
//   },
// });

// heroku
const db = knex({
  client: "pg",
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("work!");
});
app.get("/profile/:id", profile.handleProfile(db, bcrypt));
app.post("/signin", signin.handleSignIn(db, bcrypt));
app.post("/register", register.handleRegister(db, bcrypt));
app.put("/img", img.handleImage(db, bcrypt));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
