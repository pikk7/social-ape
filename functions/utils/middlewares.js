const { admin, db } = require("./admin");

exports.firebaseAuth = (req, res, next) => {
  let idToken;
  console.log(req.headers.authorization);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else {
    console.error("No token found");
    return res.status(403).json({ error: "Unathorized" });
  }

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodecToken) => {
      req.user = decodecToken;
      console.log(decodecToken);
      return db
        .collection("users")
        .where("userId", "==", req.user.uid)
        .limit(1)
        .get();
    })
    .then((data) => {
      req.user.username = data.docs[0].data().username;
      return next();
    })
    .catch((err) => {
      console.error("Error while veryfind token", err);
      return res.status(403).json(err);
    });
};
