const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const DiscordStrategy = require('passport-discord').Strategy;
  
passport.serializeUser((user , done) => {
    done(null , user);
})
passport.deserializeUser(function(user, done) {
    done(null, user);
});
  
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL:"http://localhost:3000/auth/callback",
    passReqToCallback:true
  },
  function(request, accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL:"http://localhost:3000/DiscordAuth/callback",
    authorizationURL: 'https://discord.com/api/oauth2/authorize?client_id=1093621810630766602&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2FDiscordAuth%2Fcallback&response_type=code&scope=identify%20guilds%20email',
    scope: ['email', 'identify', 'guilds'],
    passReqToCallback:true
  },
  function(request, accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));
    

