const { Pool } = require('pg')
const pool = new Pool()

const handleRegister = (db, bcrypt) => (req, res) => {
  const { name, password, email } = req.body;
  const hash = bcrypt.hashSync(password);
  

  if (!name || !password || !email) {
    return res.status(400).json("incorrect form submission");
  }

  // insert data to database
  (async () => {
    const db = await pool.connect()
    try {
      await db.query('BEGIN')
      const queryText = 'INSERT INTO login(email, hash) VALUES($1,$2) RETURNING email'
      const response = await db.query(queryText, [email, hash])
      console.log(1);
      console.log(response);
      console.log(1);
      const insertuser = 'INSERT INTO users(name, email, hash) VALUES ($1, $2, $3)'
      const insertuserValues = [name, response.rows[0].email, password]
      await db.query(insertuser, insertuserValues)
      await db.query('COMMIT')
    } catch (e) {
      await db.query('ROLLBACK')
      throw e
    } finally {
      db.release()
    }
  })().catch(e => console.error(e.stack))

};

module.exports = {
  handleRegister: handleRegister,
};
