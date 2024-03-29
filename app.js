if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express');
const session = require('express-session');
const path = require('path');
const mongoose = require ('mongoose');
const ejsMate = require('ejs-mate');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');


const dbUrl = process.env.DB_URL;

const userRoutes = require('./routes/users');
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');
// mongodb://localhost:27017/yelp-camp

mongoose.connect(dbUrl);
const db =mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open",()=>{
    console.log("Database connected")
})

const app = express();

app.engine('ejs',ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')));



app.use(session(sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge:  1000 * 60 * 60 * 24 * 7
    }
}))



app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(flash());
//flash middleware
app.use((req ,res, next) =>{
    console.log(req.query)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
   next();
})

app.use('/', userRoutes);
app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/review', reviews)

app.get('/', (req,res)=>{
    res.render('home')
});

app.all('*', (req,res,next)=>{
    next(new ExpressError('Page Not Found', 404))
})

app.use((err,req, res,next)=>{
    const {statusCode = 500 , message = 'Something Went Wrong'} = err;
    if(!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
    
})

app.listen(3000, ()=>{
    console.log('Serving on port 3000')
})