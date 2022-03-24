const express = require("express");
const path = require("path");
// execute express
const app = express();
// NEVER change this
const PORT = process.env.PORT || 3001;
// Middleware - what happens inbetween our request and responses. Here we are telling it to serve a static public directory(this is client side, the front end!).
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// listen for a request at any request made at the port.
app.get("*", (req, res) => {
  // render index.js
  res.sendFile(path.join(__dirname, "/public/index.html"));
});
app.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`));
