const functions = require("firebase-functions");
const { db } = require("./utils/admin");
const {
  getAllScreams,
  postOneScream,
  getScream,
  commentOnScream,
  unlikeScream,
  likeScream,
  deleteScream,
} = require("./handlers/scream");
const {
  signUp,
  login,
  getAllUsers,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsRead,
} = require("./handlers/user");
const { firebaseAuth } = require("./utils/middlewares");

const cors = require("cors");

const app = require("express")();
app.use(cors());
//screams routes
app.get("/screams", getAllScreams);
app.post("/scream", firebaseAuth, postOneScream);
app.get("/scream/:screamId", getScream);
// TODO:delete
app.delete("/scream/:screamId", firebaseAuth, deleteScream);
app.get("/scream/:screamId/unlike", firebaseAuth, unlikeScream);

app.get("/scream/:screamId/like", firebaseAuth, likeScream);
app.post("/scream/:screamId/comment", firebaseAuth, commentOnScream);

//users routes
app.get("/users", getAllUsers);
app.post("/signup", signUp);
app.post("/login", login);
app.post("/user/image", firebaseAuth, uploadImage);
app.post("/user", firebaseAuth, addUserDetails);
app.get("/user", firebaseAuth, getAuthenticatedUser);
app.get("/user/:username", getUserDetails);
app.post("/notifications", firebaseAuth, markNotificationsRead);

exports.createNotificationOnLike = functions
  .region("europe-west3")
  .firestore.document("likes/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        if (doc.exists && doc.data().username !== snapshot.data().username) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().username,
            sender: snapshot.data().username,
            type: "like",
            read: false,
            screamId: doc.id,
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });

exports.deleteNotificationOnUnLike = functions
  .region("europe-west3")
  .firestore.document("likes/{id}")
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((e) => {
        console.error(e);
      });
  });

exports.createNotificationOnComment = functions
  .region("europe-west3")
  .firestore.document("comments/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        if (doc.exists && doc.data().username !== snapshot.data().username) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().username,
            sender: snapshot.data().username,
            type: "comment",
            read: false,
            screamId: doc.id,
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });

exports.onUserImageChange = functions
  .region("europe-west3")
  .firestore.document("/users/{userId}")
  .onUpdate((change) => {
    // console.log(change.before.data());
    // console.log(change.after.data());
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      console.log("image change");
      const batch = db.batch();
      return db
        .collection("screams")
        .where("username", "==", change.before.data().username)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            const scream = db.doc(`/screams/${doc.id}`);
            batch.update(scream, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        });
    } else {
      return true;
    }
  });

exports.onScreamDelete = functions
  .region("europe-west3")
  .firestore.document("/screams/{screamId}")
  .onDelete((snapshot, context) => {
    const screamId = context.params.screamId;
    const batch = db.batch();
    return db
      .collection("comments")
      .where("screamId", "==", screamId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db.collection("likes").where("screamId", "==", screamId).get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection("notifications")
          .where("screamId", "==", screamId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch((err) => {
        console.error(err);
      });
  });

exports.api = functions.region("europe-west3").https.onRequest(app);
