var router = require('express').Router();
var Challenge = require('../../models/model_divider.js').model("Challenge");
var lib = require('./api-helper.js');
var api = require('./api-handler.js');


router.post('/', api.logged, api.post(Challenge));
router.get('/', api.list(Challenge) );
router.get('/:id', api.get(Challenge));
router.put('/:id', api.put(Challenge));
router.delete('/:id', api.delete(Challenge));

//testcases
router.get('/:id/testcases/', api.list_endpoint(Challenge , "testcases"));
router.post('/:id/testcases/', api.post_endpoint(Challenge , "testcases"));
router.get('/:id/testcases/:field_id', api.get_endpoint(Challenge , "testcases"));
router.put('/:id/testcases/:field_id', api.put_endpoint(Challenge , "testcases"));
router.delete('/:id/testcases/:field_id', api.delete_endpoint(Challenge , "testcases"));


module.exports = router;