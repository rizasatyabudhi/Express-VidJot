const express = require("express");
const app = express();
const port = 5000;

app.get("/", (req, res) => {
  res.send("INDEX");
});

app.get("/about", (req, res) => {
  res.send("ABOUT");
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
