const Clarifai = require("clarifai");

const clarifaiApp = new Clarifai.App({
  apiKey: "2640b395f7c349148a8ce86d50ab5b98",
});

const handleImage = (db, bcrypt) => (req, res) => {
  const { id, imgURL } = req.body;

  console.log(id);
  console.log(imgURL);
  clarifaiApp.models
    .predict("a403429f2ddf4b49b307e318f00e528b", imgURL)
    .then((response) => {
        db.query('UPDATE users SET entries = entries+1 WHERE id = $1 RETURNING entries;', [id], (error, entries) => {
          if (entries.length) {
            console.log(entries);
            res.json({
              entries: entries.rows[0].entries,
              results: response,
            });
          } else {
            res.status(400).json(`server error: ${error}`);
          }
        });  
    })
    .catch((err) => res.status(400).json(err));
};

module.exports = {
  handleImage: handleImage,
};
