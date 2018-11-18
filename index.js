//global variables
const PORT = process.env.PORT || 5000;

//modules
var app = require('express')();
var fs = require('fs');
var pth = require('path');


//middlewares
var bodyParser  = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({extended: true});

app.use(urlencodedParser);
app.use(bodyParser.json());
app.set('view engine','ejs');

app.get('/',function(req,res)
{
	res.render('pages/welcome')
});

//getting-started
app.get('/try/*',function(req,res){
	var path = req.originalUrl.substr(17,req.originalUrl.length-17);
	res.sendFile(pth.join(__dirname,"/try/",path));
});

app.listen(PORT , (err)=> {
	console.log("We are at port "+PORT);
} );
