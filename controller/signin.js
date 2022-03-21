const handleSignIn = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;

  if (!password || !email) {
    return res.status(400).json("incorrect form submission");
  }

    db.query('SELECT email, hash FROM login WHERE email = $1', [email], (error, response) => {
      const isValid = bcrypt.compareSync(password, response.rows[0].hash);
      if(!isValid){
        return res.status(400).json("invalid password or email");
      }
      db.query('SELECT * FROM users WHERE email = $1', [email], (error2, user) => {
        res.json(user.rows[0])
      })
    });
};