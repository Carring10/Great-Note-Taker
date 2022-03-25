const { randomUUID } = require("crypto");
const express = require("express");
const path = require("path");
const fs = require("fs");
const noteData = require("./db/db.json");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route for notes.html file
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});
// Return saved notes as JSON
app.get("/api/notes", (req, res) => {
  // res.json(noteData);
  fs.readFile("./db/db.json", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
      console.log("RESULT", result);
    }
  });
});

app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;
  // New notes save to the request body.
  const newNote = {
    title,
    text,
    note_id: randomUUID(),
  };
  // Then it returns the new note to the client.
  const readAndAppend = (content, filePath) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedContent = JSON.parse(data);
        console.log(parsedContent);
        parsedContent.push(content);
        console.log("DATA", parsedContent);
        writeToFile("./db/db.json", parsedContent);
        res.send("success!");
      }
    });
  };

  readAndAppend(newNote, "./db/db.json");

  // It is added to the db.json file.
  const writeToFile = (destination, content) =>
    fs.writeFile(destination, JSON.stringify(content), (err) =>
      err ? console.error(err) : console.log("success")
    );
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`));
