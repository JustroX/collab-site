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


//angular tutorial
var names = [];
app.get('/angular-tutorial-1/names',function(req,res)
{
	res.send(JSON.stringify(names));
});
app.post('/angular-tutorial-1/names',function(req,res)
{
	names.push(req.body.form);
	res.send({ success: "Yey	" });
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



