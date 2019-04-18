const GoogleStrategy = require('passport-google-oauth')
    .OAuth2Strategy;

module.exports = function (passport) {
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
    passport.use(new GoogleStrategy({
        clientID: "94203692968-v8821qla15ijtmv0n2qq39al9vacrgng.apps.googleusercontent.com",
        clientSecret: "T8BYCxeJG7WzvvrwQxuPycPA",
        callbackURL: '/auth/google/callback'
    }, (token, refreshToken, profile, done) => {
        return done(null, {
            profile: profile,
            token: token
        });
    }));
};
