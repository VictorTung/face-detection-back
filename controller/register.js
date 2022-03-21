const { Pool } = require('pg')
const pool = new Pool()

const handleRegister = (db, bcrypt) => async (req, res) => {
  const { name, password, email } = req.body;
  const hash = bcrypt.hashSync(password);

  if (!name || !password || !email) {
    return res.status(400).json("incorrect form submission");
  }

  // insert data to database
  // db.transaction((trx) => {
  //   trx
  //     .insert({ email, hash })
  //     .into("login")
  //     .returning("email")
  //     .then((loginEmail) => {
  //       return trx("users")
  //         .returning("*")
  //         .insert({
  //           name: name,
  //           email: email,
  //           joined: new Date(),
  //         })
  //         .then((user) => res.json(user[0]))
  //         .catch((err) => res.status(400).json("unable to get user"));
  //     })
  //     .then(trx.commit)
  //     .catch(trx.rollback);
  // })
  // .catch(err=> res.status(400).json('unable to register'))
  
  const client = await pool.connect()

  try{
    const loginText = `INSERT INTO login(email, hash) VALUES($1, $2) RETURNING email`
    const loginValue = [email, password]
    const res = await client.query(loginText, loginValue)

    const userText = 'INSERT INTO users(name, email) VALUES($1, $2)'
    const userValue = [name, res.rows[0].email]
    const user = await client.query(userText, userValue)
    res.json(user[0])
    await client.query('COMMIT')
  } catch(e){
    await client.query('ROLLBACK')
    res.status(400).json('some errorrrr')
  } finally {
    client.release()
  }
  client.end();
};

module.exports = {
  handleRegister: handleRegister,
};
