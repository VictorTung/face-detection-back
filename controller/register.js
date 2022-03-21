const { Pool } = require('pg')
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

const handleRegister = (bcrypt) => (req, res) => {
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
      const insertuser = 'INSERT INTO users(name, email, joined) VALUES ($1, $2, $3) RETURNING *'
      const insertuserValues = [name, response.rows[0].email, new Date()]
      const user = await db.query(insertuser, insertuserValues)
      res.json(user.rows[0])
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
