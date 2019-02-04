var router = require('express').Router();
var User = require('../../models/model_divider.js').model("User");
var lib = require('./api-helper.js');
var api = require('./api-handler.js');





router.post('/', api.post(User));
router.get('/', api.list(User) );

router.get('/self', api.logged, function(req,res,next)
{
	req.params.id = req.session.passport.user;
	next();
}, api.get(User));

router.get('/:id', api.get(User));
router.put('/:id', api.put(User));
router.delete('/:id', api.delete(User));



//follows
router.get('/:id/follows/', api.list_endpoint(User , "follows"));
router.post('/:id/follows/', api.post_endpoint(User , "follows"));
router.get('/:id/follows/:field_id', api.get_endpoint(User , "follows"));
router.put('/:id/follows/:field_id', api.put_endpoint(User , "follows"));
router.delete('/:id/follows/:field_id', api.delete_endpoint(User , "follows"));


module.exports = router;