const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { Database } = require('../db/databaseQueries');
const { query } = require('../db/index');

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
    },
    async (email, password, done) => {
        console.log(email);
        console.log(password);
        try {
            if (!email || !password) throw new Error('Missing Credentials');
            const user = await Database.selectUserByEmail(email);
            const validPassword = await Database.compareUserPassword(email, password);
            if (!user) return done(null, false, { msg: 'No user was found!'});
            if (!validPassword) return done(null, false, { msg: 'Invalid password!' });
            return done(null, user);
        } catch (err) {
            console.log(err);
            done(err, null);
        }
    }
));

passport.serializeUser((user, done) => {
    console.log({
        action: 'Serializing user...',
        user: user
    });
    done(null, {username: user.username, email: user.email});
});

passport.deserializeUser(async (user, done) => {
    console.log({
        action: 'Deserializing user...',
        user: user
    });
    try {
        const userInfo = await Database.selectUserByEmail(user.email);
        if (!userInfo) throw new Error('User not found');
        done(null, user);
    } catch (err) {
        console.log(err);
        done(err, null);
    }
});