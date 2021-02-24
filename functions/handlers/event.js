const { db } = require("../utils/admin");
const functions = require("firebase-functions");
const { isEmpty } = require("../utils/validators");
exports.getAllEvents = (req, res) => {
  functions.logger.info("get events", { structuredData: true });

  db.collection("events")
    .orderBy("start", "desc")
    .get()
    .then((data) => {
      let users = [];
      data.forEach((doc) => {
        users.push(doc.data());
      });
      return res.json(users);
    })
    .catch((e) => console.log(e));
};

exports.postOneEvent = (req, res) => {
  functions.logger.info("new event", { structuredData: true });

  let errors = {};
  const newEvent = {
    ...req.body,
    createdAt: new Date().toISOString(),
    createdBy: req.user.username,
  };
  if (newEvent.start === undefined || isEmpty(newEvent.start)) {
    errors.start = "It can't be empty";
  }
  if (newEvent.place === undefined || isEmpty(newEvent.place)) {
    errors.place = "It can't be empty";
  }
  if (newEvent.description === undefined || isEmpty(newEvent.description)) {
    errors.description = "It can't be empty";
  }
  if (newEvent.name === undefined || isEmpty(newEvent.name)) {
    errors.name = "It can't be empty";
  }

  if (Object.keys(errors) > 0) {
    return res.status(400).json({ errors });
  }

  // db.doc(`/events/${newEvent.id}`)
  //   .get()
  //   .then((doc) => {
  //     if (doc.exists) {
  //       return res.status(400).json({ id: "This id is alredy taken" });
  //     }
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     return res.status(500).json({ error: err.code });
  //   });

  db.doc(`/events/${newEvent.id}`)
    .set(newEvent)
    .then(() => {
      return res.status(201).json(newEvent);
    })
    .catch((err) => {
      console.log(err);

      return res.status(500).json({ error: err.code });
    });
};
