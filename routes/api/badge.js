var router = require('express').Router();
var Badge = require('../../models/model_divider.js').model("Badge");
var lib = require('./api-helper.js');
var api = require('./api-handler.js');


router.post('/', api.logged, api.post(Badge));
router.get('/', api.list(Badge) );
router.get('/:id', api.get(Badge));
router.put('/:id', api.put(Badge));
router.delete('/:id', api.delete(Badge));


module.exports = router;