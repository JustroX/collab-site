//global variables
const PORT = process.env.PORT || 5000;
const DATABASE_URI = process.env.DATABASE_URI;

//modules
var app = require('express')();
var fs = require('fs');
var pth = require('path');

var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

//middlewares
var cookieParser = require('cookie-parser')
var bodyParser  = require("body-parser");
var session = require('express-session');

var urlencodedParser = bodyParser.urlencoded({extended: true});

//schema
require("./models/model_divider.js").init();


var configDB = DATABASE_URI  || require('./config/database.js');
var MongoStore = require('connect-mongo')(session);
mongoose.connect(configDB.url);

require('./config/passport.js')(passport);

app.use(urlencodedParser);
app.use(cookieParser());
app.use(bodyParser.json());

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

app.use(allowCrossDomain);
// app.configure(function() {
    //some other code
// });   

//required for passport
app.use(session({ secret : '18BB2B8E71D3D158F759B6A7C98D0EC2B3BF80189296C0198FD36761781FDE4C' ,
    maxAge: new Date(Date.now() + 3600000),
    store: new MongoStore({mongooseConnection:mongoose.connection}) }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.set('view engine','ejs');
app.set('views', __dirname + '/views');
app.get('/',function(req,res)
{
	res.render('pages/index')
});

require('./routes/routes.js')(app, passport);
app.use('/api', require('./routes/api.js'));


app.listen(PORT , (err)=> {
	console.log("We are at port "+PORT);
} );



