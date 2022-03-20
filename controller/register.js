const handleRegister = (db, bcrypt) => (req, res) => {
  const { name, password, email } = req.body;
  const hash = bcrypt.hashSync(password);

  if (!name || !password || !email) {
    return res.status(400).json("incorrect form submission");
  }

  // insert data to database
  db.transaction((trx) => {
    trx
      .insert({ email, hash })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            name: name,
            email: email,
            joined: new Date(),
          })
          .then((user) => res.json(user[0]))
          .catch((err) => res.status(400).json("unable to get user"));
      })
      .then(trx.commit)
      .catch(trx.rollback);
  });
};

module.exports = {
  handleRegister: handleRegister,
};
