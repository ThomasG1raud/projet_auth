const db = require("../models");
const User = db.user;

const authRole = (role) => {
  return (req, res, next) => {
    User.findByPk(req.userId).then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: "L'utilisateur n'est pas dans la base de donnée" });
      }

      if (user.role !== role) {
        return res.status(403).send({
          message: "Vous n'êtes pas autorisé à accéder à cette ressource.",
        });
      }

      next();
    });
  };
};

module.exports = authRole;
