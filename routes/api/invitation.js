var router  = require('express').Router();
var lib     = require('./api-helper.js')
var Invitation = require('../../models/invitation.js');

var PERMISSIONS  = 
{	
	_id: 1,
	email : 3,
	invited_by : 1,
	createdAt: 1,
	confirmed : 1,
	user: 1,
}

router.post('/', lib.logged , function(req, res){
	let body = req.body;
	if(! lib.validate_fields(req,res,PERMISSIONS)) return;

	let invitation = new Invitation();
	for(let i in PERMISSIONS)
	{
		if(PERMISSIONS[i]&2)
		{
			invitation[i] = req.body[i];
		}
	}
	invitation.invited_by = req.session.passport.user
	invitation.save(function(err)
	{
		if(err) throw err;
		let output = lib.hide_fields(invitation,PERMISSIONS);
		return res.send(output);
	});

});

router.post('/confirm', lib.logged , function(req, res){
	let body = req.body;
	let id = body._id;
	Invitation.findById(id,function(err,inv)
	{
		if(err) return res.send({ err: "Database Error" , code : 500  });
		inv.confirmed = true;
		inv.user = body.user;
		inv.save(function(err)
		{
			if(err) return res.send({ err: "Database Error" , code : 500  });
			return res.send({ success: "Invitation has been confirmed" });
		})
	});
});

router.get('/', function(req, res){
	let fields = lib.fields(req,PERMISSIONS);
	let sort = lib.sort(req,PERMISSIONS);
	let query = lib.filter(req,PERMISSIONS);
	let options = req.query.option;

	let limit =  (req.query.limit || 10)-1+1;
	let offset = (req.query.offset || 0)-1+1;

	if(options)
	{
		let opt = {};
		Invitation.count({},function(err,count)
		{
			opt.collectionCount = count;
			res.send(opt);
		});
	}
	else
	Invitation.find(query,fields.join(' ')).sort(sort).limit(limit).skip(limit*offset).populate("invited_by","name username private.local.email").exec(function(err,docs)
	{
		if(err) throw err;
		res.send(docs);
	});
});

router.get('/:id', function(req, res){

	let post_id = req.params.id;
	let fields = lib.fields(req,PERMISSIONS);
	let sort = lib.sort(req,PERMISSIONS);
	let options = req.query.option;

	Invitation.find({_id:post_id},fields.join(' ')).populate("invited_by","name username private.local.email").exec(function(err,invitation)
	{
		if(!invitation) return res.send({ code: 500 , err: 'Invitation not found.' });
		res.send(invitation[0]);
	});

});


router.put('/:id', lib.logged , function(req, res){
	res.send({err:"Permission Denied", code: 403});
});

router.delete('/:id', lib.logged , function(req, res){
	res.send({err:"Permission Denied", code: 403});
});

module.exports = router;