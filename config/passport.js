const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
          });
          await user.save();
        }

        const accessToken = jwt.sign(
          { id: user._id },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        
        const refreshToken = jwt.sign(
          { id: user._id },
          process.env.JWT_REFRESH_SECRET,
          { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
        );
        
        done(null, { user, accessToken, refreshToken });
        
      } catch (error) {
        done(error);
      }
    }
  )
);

module.exports = passport;
