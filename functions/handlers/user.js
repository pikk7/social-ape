const functions = require("firebase-functions");

const {
  validateSignUpData,
  validateLoginData,
  reduceUserDetails,
} = require("../utils/validators");
const { admin, db } = require("../utils/admin");
const firebaseConfig = require("../utils/config");
const firebase = require("firebase");
const config = require("../utils/config");
firebase.initializeApp(firebaseConfig);

exports.signUp = (req, res) => {
  functions.logger.info("Sign up", { structuredData: true });

  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    username: req.body.username,
  };

  const { valid, errors } = validateSignUpData(newUser);

  if (!valid) {
    res.status(400).json(errors);
  }
  const noImg = "profile.svg";
  let token, userId;
  db.doc(`/users/${newUser.username}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res
          .status(400)
          .json({ username: "This username is alredy taken" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idToken) => {
      token = idToken;
      const userCred = {
        username: newUser.username,
        email: newUser.email,
        firstAid: 0,
        simulation: 0,
        facePainting: 0,
        drog: 0,
        sex: 0,
        isAdmin: false,
        createdAt: new Date().toISOString(),
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
        userId,
      };
      return db.doc(`/users/${newUser.username}`).set(userCred);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch((err) => {
      console.log(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ email: "Email is already use" });
      } else if (err.code === "auth/weak-password") {
        return res.status(400).json({
          email: "It has to be at least 6 chacachter ",
        });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
};

exports.login = (req, res) => {
  functions.logger.info("login", { structuredData: true });

  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  const { valid, errors } = validateLoginData(user);

  if (!valid) {
    res.status(400).json(errors);
  }
  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.json({ token });
    })
    .catch((err) => {
      console.error(err);

      if (err.code === "auth/wrong-password") {
        return res
          .status(403)
          .json({ general: "Wrong password, please try again" });
      } else if (err.code === "auth/invalid-email") {
        return res
          .status(403)
          .json({ general: "Wrong email, please try again" });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
};

exports.getAllUsers = (req, res) => {
  db.collection("users")
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

exports.uploadImage = (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: req.headers });

  let imageFileName;
  let imageToBeUploaded = {};
  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (
      mimetype !== "image/jpeg" &&
      mimetype !== "image/png" &&
      mimetype !== "image/svg"
    ) {
      return res.status(400).json({ error: "Wrong file type submited" });
    }

    //image.png
    const imageExtension = filename.split(".")[filename.split(".").length - 1];
    imageFileName = `${Math.round(Math.random() * 10000000)}.${imageExtension}`;

    const filePath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filePath, mimetype };

    file.pipe(fs.createWriteStream(filePath));
  });

  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filePath, {
        resumable: false,
        metadata: {
          contentType: imageToBeUploaded.mimetype,
        },
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
        return db.doc(`/users/${req.user.username}`).update({ imageUrl });
      })
      .then(() => {
        return res.json({ message: "Image uploaded successfully" });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json(err);
      });
  });

  busboy.end(req.rawBody);
};

//Add user details
exports.addUserDetails = (req, res) => {
  let userDetails = reduceUserDetails(req.body);

  db.doc(`/users/${req.user.username}`)
    .update(userDetails)
    .then(() => {
      return res.json({ message: "Details added succescfully" });
    })
    .catch((e) => {
      console.error(e);

      return res.status(500).json({ error: e });
    });
};

exports.getAuthenticatedUser = (req, res) => {
  let userData = {};

  db.doc(`/users/${req.user.username}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData.credentials = doc.data();
        return db
          .collection("likes")
          .where("username", "==", req.user.username)
          .get();
      }
    })
    .then((data) => {
      userData.likes = [];
      data.forEach((doc) => {
        userData.likes.push(doc.data());
      });
      return res.json(userData);
    })
    .catch((e) => {
      console.error(e);
      return res.status(500).json({ error: e });
    });
};
