require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 1337;

app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());

app.get("/", (request, response) => {
  response.json({ info: "Tavernium Test API" });
});

app.use('/api/v1', require('./router/user_router'));

app.listen(PORT, () => {
  console.clear();
  console.log("---------------------------");
  console.log(`\x1b[32m`, `App running on port: ${PORT}!`);
  console.log(`\x1b[37m`, `http://localhost:${PORT}\n`);
});
