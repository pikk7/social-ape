const functions = require("firebase-functions");

const {
  getAllEvents,
  postOneEvent,
  getEvent,
  commentOnEvent,
} = require("./handlers/event");
const {
  signUp,
  login,
  getAllUsers,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
} = require("./handlers/user");
const { firebaseAuth } = require("./utils/middlewares");

const app = require("express")();

//event routs
app.get("/events", getAllEvents);
app.post("/event", firebaseAuth, postOneEvent);
app.get("/event/:eventId", getEvent);
// TODO:delete
// TODO:like
// TODO:unlike
// TODO:comment
app.post("/event/:eventId/comment", firebaseAuth, commentOnEvent);
//user routs
app.get("/users", getAllUsers);
app.post("/signup", signUp);
app.post("/login", login);
app.post("/user/image", firebaseAuth, uploadImage);
app.post("/user", firebaseAuth, addUserDetails);
app.get("/user", firebaseAuth, getAuthenticatedUser);

exports.api = functions.region("europe-west3").https.onRequest(app);
