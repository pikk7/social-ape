const functions = require("firebase-functions");

const { getAllEvents, postOneEvent } = require("./handlers/event");
const { signUp, login, getAllUsers, uploadImage } = require("./handlers/user");
const { firebaseAuth } = require("./utils/middlewares");

const app = require("express")();

//event routs
app.get("/events", getAllEvents);

app.post("/event", firebaseAuth, postOneEvent);

//user routs
app.get("/users", getAllUsers);
app.post("/signup", signUp);
app.post("/login", login);
app.post("/user/image", firebaseAuth, uploadImage);

exports.api = functions.region("europe-west3").https.onRequest(app);
