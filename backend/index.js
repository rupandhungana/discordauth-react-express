require("dotenv").config();
const express = require("express");
const passport = require("passport");
const Strategy = require("passport-discord").Strategy;
const morgan = require("morgan");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const bodyParser = require("body-parser");
const RateLimit = require("express-rate-limit");

// app and port
const PORT = process.env.PORT || 3000;
const app = express();

// passport things
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));


passport.use(
    new Strategy({
            clientID: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            callbackURL: process.env.CALLBACK_URL,
            scope: ["identify"]
        },
        (accessToken, refreshToken, profile, done) => {
            process.nextTick(() => done(null, profile));
        }
    )
);
app.use(
    session({
        store: new MemoryStore({
            checkPeriod: 86400000
        }),
        secret: "#@%#&^$^$%@$^$&%#$%@#$%$^%&$%^#$&#$*(%@#$%#E%#%@$FEErfgr3g#%GT%536c53cc6%5%tv%4y4hrgrggrgrgf4n9jhs9h&*&*",
        resave: false,
        saveUninitialized: false
    })
);
app.use(
    RateLimit({
        windowMs: 1 * 60 * 1000, // 1 minute
        max: 50,
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({
    extended: true
}));

// routes
app.get('/', (req, res) => {
    res.send("ok")
})
const PREFIX = '/api';

app.get(`${PREFIX}/login`, passport.authenticate('discord'), (req, res) => {
    res.status(200)
})

app.get(`${PREFIX}/session`, (req, res) => {
    if (req.user) {
        let user = req.user;
        if (user.avatar) {
            user.avatarURl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith("a_") ? "gif" : "png"}?size=2048`;
        } else if (user.discriminator !== "0") {
            user.avatarURl = `https://cdn.discordapp.com/embed/avatars/${Number(user.discriminator) % 5}.png`;
        } else {
            user.avatarURl = `https://cdn.discordapp.com/embed/avatars/${(user.id >> 22) % 6}.png`;
        }
        res.send(user)
    } else {
        res.status(401).send({
            message: 'Unauthorized'
        });
    }
});

app.get(
    `${PREFIX}/callback`,
    passport.authenticate("discord", {
        failureRedirect: "/error?code=999&message=Weencountered an error while connecting."
    }),
    async (req, res) => {
        res.redirect(process.env.WEB);
    }
);
app.get(`${PREFIX}/logout`, function (req, res) {
    req.session.destroy(() => {
        req.logout();
        res.redirect(process.env.WEB);
    });
});


app.listen(80, () => {
    console.log('server listening on port :80')
})