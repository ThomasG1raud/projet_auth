require('dotenv').config();
module.exports = {
    secret: "shrek",
    jwtExpiration: 60,
    jwtRefreshExpiration: 120
};