const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const RefreshToken = db.refreshToken;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const NodeCache = require("node-cache");
const cache = new NodeCache();
const control = require('../controllers/auth.controller');
const chalk = require('chalk')
const EventEmitter = require('events');
class TokenEventEmitterHandler {
  constructor() {
    this.emitter = new EventEmitter();
  }
  onCreation(){
    this.emitter.on("token_creation", async(args)=>{
      console.log(chalk.red.inverse("creation start"));
      await control.signin(args.req,args.res);
      console.log(chalk.red.inverse("creation end"));
    });
  }
  emitCreation(req, res){
    this.emitter.emit("token_creation",{req:req, res:res});
  }
  onRefresh(){
    this.emitter.on("token_refresh", async (arg)=>{
      console.log(chalk.blue.inverse("refreshing start"));
      const refreshed = await control.refreshToken(arg.req, arg.res);
      console.log(chalk.blue.inverse("refreshing end"));
      console.log("The refreshed token : "+refreshed);
    })
  }
  emitRefresh(req, res){
    this.emitter.emit("token_refresh", {req:req, res:res})
  }
}

exports.signup = (req, res) => {
  // Enregistrer l'utilisateur dans la base de données
  User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    emailId: req.body.emailId,
    password: bcrypt.hashSync(req.body.password, 8),
  })
    .then((user) => {
      res.send({ message: "L'utilisateur a été enregistré avec succès!" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.signinUs = async (req, res) =>{
  const eventEmitterHandler = new TokenEventEmitterHandler();
  eventEmitterHandler.onCreation();
  eventEmitterHandler.emitCreation(req, res);
}

exports.signin = async (req, res) => {
  const cacheKey = `user:${req.body.emailId}`;
  let user = cache.get(cacheKey);

  if (!user) {
    user = await User.findOne({
      where: {
        emailId: req.body.emailId,
      },
    }).catch((err) => {
      return res.status(500).send({ message: err.message });
    });

    if (!user) {
      return res.status(404).send({ message: "Utilisateur non trouvé." });
    }

    cache.set(cacheKey, user);
  }

  let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

  if (!passwordIsValid) {
    return res.status(401).send({
      accessToken: null,
      message: "Mot de passe incorrect!",
    });
  }

  let token = jwt.sign({ id: user.id }, config.secret, {
    expiresIn: config.jwtExpiration,
  });

  let refreshToken = await RefreshToken.createToken(user);

  res.status(200).send({
    id: user.id,
    username: user.emailId,
    accessToken: token,
    refreshToken: refreshToken,
  });
};

exports.refreshingToken = async(req, res) => {
  const data = req.body;
  const eventEmitter = new EventEmitterHandler();
  eventEmitter.onRefresh();
  eventEmitter.emitRefresh(data);
}

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;
  if (requestToken == null) {
    return res
      .status(403)
      .json({ message: "Le jeton d'actualisation est requis!" });
  }
  try {
    let refreshToken = await RefreshToken.findOne({
      where: { token: requestToken },
    });
    console.log(refreshToken);
    if (!refreshToken) {
      res.status(403).json({
        message: "Le jeton d'actualisation n'est pas dans la base de données!",
      });
      return;
    }
    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.destroy({ where: { id: refreshToken.id } });
      res.status(403).json({
        message:
          "Le jeton d'actualisation a expiré. Veuillez faire une nouvelle demande de connexion",
      });
      return;
    }
    const user = await refreshToken.getUser();
    let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });
    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};
