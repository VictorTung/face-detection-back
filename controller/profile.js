const handleProfile = (db) => (req, res) => {
  const { id } = req.params;
    db.query('SELECT * FROM users WHERE id = $1', [id], (error, response) => {
      res.json(response.rows[0])
    });
};

module.exports = {
  handleProfile: handleProfile,
};
