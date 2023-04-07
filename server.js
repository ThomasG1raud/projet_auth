const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const passport = require("passport");
const cookieSession = require("cookie-session");
require("./config/passport");
const getBooks = require("./scrape/books");
const path = require("path");
const cache = require("./middleware/cache");
const PathPagePrincipale = path.resolve(
  __dirname,
  "./templates/PagePrincipale.html"
);

const app = express();
let corsOptions = {
  origin: "http: /localhost:3000",
};

app.use(
  cookieSession({
    name: "auth-session",
    keys: ["google-key1", "google-key2", "discord-key1", "discord-key2"],
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.sendFile(PathPagePrincipale);
});

// Auth
app.get(
  "/auth",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/DiscordAuth",
  passport.authenticate("discord", { scope: ["email", "profile"] })
);

// Auth Callback
app.get(
  "/auth/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/callback/success",
    failureRedirect: "/auth/callback/failure",
  })
);

app.get(
  "/DiscordAuth/callback",
  passport.authenticate("discord", {
    successRedirect: "/auth/callback/success",
    failureRedirect: "/auth/callback/failure",
  })
);

// Success
app.get("/auth/callback/success", (req, res) => {
  if (!req.user) res.redirect("/auth/callback/failure");
  res.send("Welcome " + req.user.email);
});

// failure
app.get("/auth/callback/failure", (req, res) => {
  res.send("Error");
});

app.use(cors(corsOptions));
// analyser les requêtes de type de contenu - application/json
app.use(bodyParser.json());
// analyser les requêtes de type de contenu - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

/** Swagger Initialization - START */
const swaggerSpec = swaggerJsdoc({
  swaggerDefinition: {
    openapi: "3.0.2",
    info: {
      title: "Projet Web",
      version: "1.0.0",
      description: "API documentation",
      servers: [`http://localhost:${process.env.PORT || 3000}/`],
    },
    components: {
      securitySchemes: {
        jwt: {
          type: "http",
          scheme: "bearer",
          in: "header",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        jwt: [],
      },
    ],
  },
  apis: ["server.js", "./routes/*.js"],
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
/** Swagger Initialization - END */
app.get("/", (req, res) => {
  res.json({ message: "Bienvenue dans l'application : Auth JWT" });
});

app.get("/books", cache(200), async (req, res) => {
  const books = await getBooks(
    "http://books.toscrape.com/catalogue/category/books_1/"
  );
  res.json(books);
});

const db = require("./models");
db.sequelize.sync().then(() => {
  console.log("Database synchronized successfully");
});

// routes
require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);

// définir le port, écouter les requêtes
const PORT = process.env.PORT | 3000;
app.listen(PORT, () => {
  console.log(`Serveur écoute sur le port ${PORT}.`);
});
