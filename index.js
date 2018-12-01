//global variables
const PORT = process.env.PORT || 5000;

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

var configDB = require('./config/database.js');
var MongoStore = require('connect-mongo')(session);
mongoose.connect(configDB.url);

require('./config/passport.js')(passport);

app.use(urlencodedParser);
app.use(cookieParser());
app.use(bodyParser.json());

//required for passport
app.use(session({ secret : '18BB2B8E71D3D158F759B6A7C98D0EC2B3BF80189296C0198FD36761781FDE4C' ,
    maxAge: new Date(Date.now() + 3600000),
    store: new MongoStore({mongooseConnection:mongoose.connection}) }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.set('view engine','ejs');

app.get('/',function(req,res)
{
	res.render('pages/index')
});

//test for passport and mongoose
require('./routes/routes.js')(app, passport);


//angular tutorial
var names = [];
app.get('/angular-tutorial-1/names',function(req,res)
{
	res.send(JSON.stringify(names));
});
app.post('/angular-tutorial-1/names',function(req,res)
{
	if(!req.body.form) return res.send({ err: "Invalid Parameter"});
	names.push(req.body.form);
	res.send({ success: "Done" });
});


//getting-started
app.get('/try/*',function(req,res){
	var path = req.originalUrl.substr(5,req.originalUrl.length-5);
	res.sendFile(pth.join(__dirname,"/try/",path));
});

//api route 
app.use('/api', require('./routes/api.js'));


app.listen(PORT , (err)=> {
	console.log("We are at port "+PORT);
} );



