require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const chathub = require("./chathub/chathub");

const app = express();
const PORT = 8000;

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.get("/", (request, response) => {
  response.json({ info: "Tavernium Test API" });
});

app.use("/api/v1", require("./actions/auth_actions"));
app.use("/api/v1", require("./actions/account_actions"));
app.use("/api/v1", require("./actions/message_actions"));
app.use("/api/v1", require("./actions/campaign_actions"));
app.use("/api/v1", require("./actions/sheet_actions"))

const server = app.listen(PORT, () => {
  console.clear();
  console.log("---------------------------");
  console.log(`\x1b[32m`, `App running on port: http://localhost:${PORT}`);
  console.log("---------------------------");
});


// Start chat service
chathub.createChathub(server);