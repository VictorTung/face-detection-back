const handleProfile = (db, bcrypt) => (req, res) => {
  const { id } = req.params;
    db.query('SELECT * FROM users WHERE id = $1', [id], (error, response) => {
      res.json(response)
    });
};

module.exports = {
  handleProfile: handleProfile,
};
