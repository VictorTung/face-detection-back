const handleSignIn = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;

  if (!password || !email) {
    return res.status(400).json("incorrect form submission");
  }

  db.select("email", "hash")
    .from("login")
    .where({ email })
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        db.select("*")
          .from("users")
          .where({ email })
          .then((user) => res.json(user[0]))
          .catch((err) => json.status(400).json("unable to get user"));
      } else {
        res.status(400).json("invalid password or email");
      }
    })
    .catch((err) => res.status(400).json("wrong"));
};

module.exports = {
  handleSignIn: handleSignIn,
};
