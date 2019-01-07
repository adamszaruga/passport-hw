
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bcrypt = require('bcryptjs');
const Database = require('./db.js');
const router = require('./router');

let db = new Database();
let app = express();

app.use(bodyParser.json());
app.use(session({secret: 'mymilkshakebringsalltheboystotheyard'}));
app.set('view engine', 'ejs');

passport.use(new LocalStrategy(
    {
        usernameField: 'email'
    },
    function (email, password, done) {
        db.findUserByEmail(email).then(function(user) {
            if (!user) {
                return done(null, false);
            }
            const isCorrectPassword = bcrypt.compareSync(password, user.password)
            if (!isCorrectPassword) {
                return done(null, false);
            }
            return done(null, user);

        }).catch(function (err){
            return done(err);
        })
    }
));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(userId, done){
    db.findUserById(userId).then(user => done(null, user))
});


// Now that Passport is all set up, here are the API routes

app.get('/', function(req, res, next) {
    res.render('index', {
        isLoggedIn: req.isAuthenticated()
    });
});


app.post('/auth/login', passport.authenticate('local', { failureRedirect: '/'}), function(req, res, next){
    res.json({status: 'OK'});
});
app.get('/auth/logout', function (req, res, next) {
    req.logout();
    res.json({status: 'OK'});
});
app.post('/auth/register', function (req, res, next) {
    let creds = req.body;

    console.log('creds');
    console.log(creds);
    db.findUserByEmail(creds.email).then(function(user){
        console.log(user);
        if (!user) {
            db.createUser(creds.email, bcrypt.hashSync(creds.password, 10)).then(function(user){
                res.json({user: user, status: 'OK'});
            });
        } else {
            res.sendStatus(400);
        }
    });

});


app.listen(3000, function () {
    console.log('server is listening...')
})