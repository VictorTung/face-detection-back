const Clarifai = require("clarifai");

const clarifaiApp = new Clarifai.App({
  apiKey: "2640b395f7c349148a8ce86d50ab5b98",
});

const handleImage = (db, bcrypt) => (req, res) => {
  const { id, imgURL } = req.body;

  clarifaiApp.models
    .predict("a403429f2ddf4b49b307e318f00e528b", imgURL)
    .then((response) => {
      db("users")
        .where({ id })
        .increment("entries", 1)
        .returning("entries")
        .then((entries) => {
          if (entries.length) {
            res.json({
              entries: entries[0].entries,
              results: response,
            });
          } else {
            res.status(400).json("server error");
          }
        });
    })
    .catch((err) => res.status(400).json(err));
};

module.exports = {
  handleImage: handleImage,
};
