require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const chathub = require("./chathub/chathub");

const app = express();
const PORT = 1337;

app.use(  
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(cors());

// Register Swagger UI
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Tavernium API",
      version: "1.0.0",
      description: "Documentation of Tavernium API enpoints.",
      termsOfService: "",
      contact: {
        name: "Borna Skracic",
        url: "https://github.com/bSkracic",
        email: "borna.skracic7@gmail.com",
      },
    },

    servers: [
      {
        url: "http://localhost:1337",
        description: "Tavernium main micro service API",
      },
      {
        url: "http://localhost:6969",
        description: "Tavnerium authentication micro service API"
      }
    ],
  },
  apis: ["./docs/api-methods-docs.js"],
};

const specs = swaggerJsDoc(options);
app.use("/api/v1/docs", swaggerUI.serve, swaggerUI.setup(specs));

app.get("/", (request, response) => {
  response.json({ info: "Tavernium Test API" });
});

app.use("/api/v1", require("./actions/auth_actions"));
app.use("/api/v1", require("./actions/account_actions"));
app.use("/api/v1", require("./actions/message_actions"));
app.use("/api/v1", require("./actions/campaign_actions"));
app.use("/api/v1", require("./actions/sheet_actions"));

const server = app.listen(PORT, () => {
  console.clear();
  console.log("---------------------------");
  console.log(`\x1b[32m`, `App running on port: ${PORT}!`);
  console.log(`\x1b[37m`, `http://localhost:${PORT}\n`);
});


// Start chat service
chathub.createChathub(server);