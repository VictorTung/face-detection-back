const handleProfile = (db, bcrypt) => (req, res) => {
  const { id } = req.params;

    db.connect();

    db.query('SELECT * FROM users WHERE id = $1', [id], (error, response) => {
      console.log(response);
      console.log(error);
      res.json(response)
    });
    
    db.end();
};

module.exports = {
  handleProfile: handleProfile,
};
