const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

// const register = require('./controllers/register');
// const signin = require('./controllers/signin');
// const profile = require('./controllers/profile');
// const image = require('./controllers/image');

const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect();

const app = express();

app.use(cors());
app.use(express.json()); // latest version of exressJS now comes with Body-Parser!

app.get("/", (req, res) => {
  client
    .query('SELECT * FROM login WHERE id = $1', [1])
    .then(data=> res.json(data))
});

// app.get('/', (req, res)=> { res.send(db.login) })
// app.post('/signin', signin.handleSignin(db, bcrypt))
// app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
// app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})
// app.put('/image', (req, res) => { image.handleImage(req, res, db)})
// app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

app.listen(process.env.PORT || 3000, () => {
  console.log("app is running on port process.env.PORT");
});
