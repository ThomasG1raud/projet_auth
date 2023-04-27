const express = require("express");
const EventEmitterHandler = require('./tokenEventHandler')
const helmet = require("helmet");
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
const { preCache, resources } = require("./cache/preCache");
const cache = require("./middleware/cache");
const PathPagePrincipale = path.resolve(
  __dirname,
  "./templates/PagePrincipale.html"
);
const gallery = path.resolve(
    __dirname,
    "./templates/galerie.html"
);
const images = require("./GestImages/images.js");
const rateLimit = require("express-rate-limit");

const app = express();
app.use(helmet());

app.use(helmet.xssFilter());

app.use(helmet.noSniff());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: "Trop de requêtes",
});

let corsOptions = {
  origin: "http://localhost:3000",
  methods: ['GET', 'POST']
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

app.get("/galerie", (req, res) => {
    res.sendFile(gallery);
});

// Auth
app.get(
  "/auth",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
    "/DiscordAuth",
    passport.authenticate("discord", { scope: ["email", "identify"] })
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
    successRedirect: "/auth/callback/successDiscord",
    failureRedirect: "/auth/callback/failure",
  })
);

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

app.get("/auth/callback/successDiscord", (req, res) => {
    if (!req.user) res.redirect("/auth/callback/failure");
    console.log(req.user)
  const { username, discriminator, avatar } = req.user;

  res.send(`
    <h1>Welcome ${username}#${discriminator}</h1>
    <img src="https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png" alt="Avatar">
    <p>Here are your Discord details:</p>
    <ul>
      <li>Username: ${username}</li>
      <li>Discriminator: ${discriminator}</li>
      <li>User ID: ${req.user.id}</li>
      <li>Avatar: <img src="https://cdn.discordapp.com/avatars/${req.user.id}/${avatar}.png?size=64"></li>
    </ul>
    <a href="/logout">Logout</a>
    <br>
    <a href="/">Return to main page</a>
  `);
});

// Success
app.get("/auth/callback/success", (req, res) => {
  if (!req.user) res.redirect("/auth/callback/failure");
  console.log(req.user)
  res.send(`
        <h1>Welcome ${req.user.displayName}</h1>
        <h1>Ton adresse mail est : ${req.user.emails[0].value}</h1>
        <img src="${req.user.picture}" alt="Profile Picture">
        <a href="/logout">Logout</a>
        <br>
        <a href="/">Return to main page</a>
    `);
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

// Pre-caching pour books
preCache(cache);

app.get(
  "/books",
  cache.middleware(200, () =>
    getBooks("http://books.toscrape.com/catalogue/category/books_1/")
  ),
  limiter,
  async (req, res) => {
    const cachedBooks = await cache.get(req.originalUrl);
    if (cachedBooks) {
      res.json(cachedBooks);
    } else {
      const books = await getBooks(
        "http://books.toscrape.com/catalogue/category/books_1/"
      );
      cache.set(req.originalUrl, books, 200);
      res.json(books);
    }
  }
);

app.use("/images", images);

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
