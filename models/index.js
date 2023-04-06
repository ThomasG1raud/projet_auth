const config = require("../config/db.config");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.database, config.user, config.password, {
  host: config.hostname,
  port: config.port,
  dialect: config.dialect,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
  define: {
    timestamps: false,
  },
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("../models/user.model")(sequelize);
db.role = require("../models/role.model")(sequelize);
db.refreshToken = require("../models/refreshToken.model")(sequelize);
db.refreshToken.belongsTo(db.user, { foreignKey: "userId", targetKey: "id" });
db.user.hasOne(db.refreshToken, { foreignKey: "userId" });

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId",
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
});

db.ROLES = ["client", "admin", "superadmin"];

module.exports = db;
