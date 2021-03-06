var router = require('express').Router();
var Invitation = require('../../models/model_divider.js').model("Invitation");
var lib = require('./api-helper.js');
var api = require('./api-handler.js');


router.post('/', api.logged, function(req,res,next) {
	req.body.invited_by  = req.session.passport.user;
	req.body.confirmed = false;
	next();
}, api.post(Invitation));
router.get('/', api.list(Invitation) );
router.get('/:id',  api.get(Invitation));
router.put('/:id', api.put(Invitation));
router.delete('/:id', api.logged, api.delete(Invitation));

module.exports = router;