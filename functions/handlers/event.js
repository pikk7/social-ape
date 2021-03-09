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
  if (req.body.body.trim() === "") {
    return res.status(400).json({ error: "Must not be empty" });
  }

  let errors = {};
  const newEvent = {
    ...req.body,
    username: req.user.username,
    userImage: req.user.imageUrl,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0,
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
  functions.logger.info("new event", { structuredData: true });

  db.collection("events")
    .add(newEvent)
    .then((doc) => {
      const resEvent = newEvent;
      resEvent.eventId = doc.id;
      return res.json(resEvent);
    })
    .catch((err) => {
      console.log(err);

      return res.status(500).json({ error: err.code });
    });
};

exports.getEvent = (req, res) => {
  let eventData = {};
  functions.logger.info("get event", { structuredData: true });

  db.doc(`/events/${req.params.eventId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Event is not found" });
      }
      eventData = doc.data();
      eventData.eventId = doc.id;
      return db
        .collection("comments")
        .orderBy("createdAt", "desc")
        .where("eventId", "==", req.params.eventId)
        .get();
    })
    .then((data) => {
      eventData.comments = [];
      data.forEach((doc) => {
        eventData.comments.push(doc.data());
      });
      return res.json(eventData);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

//Comment on an event
exports.commentOnEvent = (req, res) => {
  if (req.body.body.trim() === "") {
    return res.status(400).json({ comment: "Must not be empty" });
  }
  functions.logger.info("comment event", { structuredData: true });

  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    eventId: req.params.eventId,
    username: req.user.username,
    userImage: req.user.imageUrl,
  };

  db.doc(`/events/${req.params.eventId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(400).json({ error: "Event not found" });
      }
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
      return db.collection("comments").add(newComment);
    })
    .then(() => {
      res.json(newComment);
    })
    .catch((e) => {
      console.error(e);
      return res.status(500).json({ error: "Something went wrong" });
    });
};

exports.likeEvent = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("username", "==", req.user.username)
    .where("eventId", "==", req.params.eventId)
    .limit(1);

  const eventDocument = db.doc(`/events/${req.params.eventId}`);

  let eventData;

  eventDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        eventData = doc.data();
        eventData.eventId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Event not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return db
          .collection("likes")
          .add({
            eventId: req.params.eventId,
            username: req.user.username,
          })
          .then(() => {
            eventData.likeCount++;
            return eventDocument
              .update({ likeCount: eventData.likeCount })
              .then(() => {
                return res.json(eventData);
              });
          });
      } else {
        return res.status(400).json({ error: "Event already liked" });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
  functions.logger.info("like event", { structuredData: true });
};

exports.unlikeEvent = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("username", "==", req.user.username)
    .where("eventId", "==", req.params.eventId)
    .limit(1);

  const eventDocument = db.doc(`/events/${req.params.eventId}`);

  let eventData;

  eventDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        eventData = doc.data();
        eventData.eventId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Event not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return res.status(400).json({ error: "Event not liked" });
      } else {
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            eventData.likeCount--;
            return eventDocument.update({ likeCount: eventData.likeCount });
          })
          .then(() => {
            res.json(eventData);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
  functions.logger.info("unlike event", { structuredData: true });
};

//delete event
exports.deleteEvent = (req, res) => {
  const document = db.doc(`/events/${req.params.eventId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Event not found" });
      }

      //sajat eventjet torli, ezeket majd ugyis at kell formaznom
      if (doc.data().username !== req.user.username) {
        return res.status(403).json({ error: "Unathorized" });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      res.json({ message: "Event deleted succesfully" });
    })
    .catch((e) => {
      console.error(e);
      return res.status(500).json({ error: e.code });
    });
  functions.logger.info("delete event", { structuredData: true });
};
