const config = require("../config/db.config");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.database,
    config.user,
    config.password,
    {
        host: config.hostname,
        port:config.port,
        dialect: config.dialect,
        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        },
        define: {
            timestamps: false
        }
    }
);
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("../models/user.model")(sequelize);
db.refreshToken = require("../models/refreshToken.model")(sequelize);
db.refreshToken.belongsTo(db.user, {foreignKey: 'userId', targetKey: 'id'});
db.user.hasOne(db.refreshToken, {foreignKey:'userId'});
module.exports = db;