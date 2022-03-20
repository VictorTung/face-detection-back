const { json } = require("express/lib/response");

const handleProfile = (db, bcrypt) => (req, res) => {
  const { id } = req.params;

  db("users")
    .where({ id })
    .then((response) => {
      if (response.length) {
        res.json(response[0]);
      } else {
        res.status(400).json("user not found");
      }
    });
};

module.exports = {
  handleProfile: handleProfile,
};
