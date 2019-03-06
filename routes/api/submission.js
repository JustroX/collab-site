var router = require('express').Router();
var Submission = require('../../models/model_divider.js').model("Submission");
var lib = require('./api-helper.js');
var api = require('./api-handler.js');


router.post('/', api.logged, api.postAsync(Submission, function(req,res,model, done)
{
	model.author = req.session.passport.user;
	model.date = new Date();
	model.get_verdict(res,model.challenge,done);
}) );
router.get('/', api.list(Submission) );
router.get('/:id', api.get(Submission));
router.put('/:id', api.put(Submission));
router.delete('/:id', api.delete(Submission));

module.exports = router;