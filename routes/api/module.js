var router = require('express').Router();
var Module = require('../../models/model_divider.js').model("Module");
var lib = require('./api-helper.js');
var api = require('./api-handler.js');



router.post('/', api.post(Module));
router.get('/', api.list(Module) );
router.get('/:id', api.get(Module));
router.put('/:id', api.put(Module));
router.delete('/:id', api.delete(Module));



//articles
router.get('/:id/articles/', api.list_endpoint(Module , "articles"));
router.post('/:id/articles/', api.post_endpoint(Module , "articles"));
router.get('/:id/articles/:field_id', api.get_endpoint(Module , "articles"));
router.put('/:id/articles/:field_id', api.put_endpoint(Module , "articles"));
router.delete('/:id/articles/:field_id', api.delete_endpoint(Module , "articles"));
//challenges
router.get('/:id/challenges/', api.list_endpoint(Module , "challenges"));
router.post('/:id/challenges/', api.post_endpoint(Module , "challenges"));
router.get('/:id/challenges/:field_id', api.get_endpoint(Module , "challenges"));
router.put('/:id/challenges/:field_id', api.put_endpoint(Module , "challenges"));
router.delete('/:id/challenges/:field_id', api.delete_endpoint(Module , "challenges"));
//badges
router.get('/:id/badges/', api.list_endpoint(Module , "badges"));
router.post('/:id/badges/', api.post_endpoint(Module , "badges"));
router.get('/:id/badges/:field_id', api.get_endpoint(Module , "badges"));
router.put('/:id/badges/:field_id', api.put_endpoint(Module , "badges"));
router.delete('/:id/badges/:field_id', api.delete_endpoint(Module , "badges"));

module.exports = router;