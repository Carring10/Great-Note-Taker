const { randomUUID } = require("crypto");
const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");
const noteData = require("./db/db.json");
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
// returns notes.html file
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});
// return saved notes as JSON
app.get("/api/notes", (req, res) => res.json(noteData));

// new notes save on the request body, then adds it to the db.json file, then returns that new note to the client. Each note will have a unique id when it is saved.
app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      note_id: randomUUID(),
    };

    const writeToFile = (destination, content) =>
      fs.writeFile(destination, JSON.stringify(content), (err) =>
        err ? console.error(err) : console.info(`\nData written to ${destination}`)
      );

    const readAndAppend = (content, filePath) => {
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          console.error(err);
        } else {
          const parsedData = JSON.parse(data);
          parsedData.push(content);
          writeToFile("./db/db.json", parsedData);
          res.send("success!");
        }
      });
    };
    readAndAppend(newNote, "./db/db.json");
  } else {
    res.error("Error in adding note");
  }
});

app.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`));
