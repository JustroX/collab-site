var router = require('express').Router();
var Article = require('../../models/model_divider.js').model("Article");
var lib = require('./api-helper.js');
var api = require('./api-handler.js');


router.post('/', api.logged, api.post(Article));
router.get('/', api.list(Article) );
router.get('/:id', api.get(Article));
router.put('/:id', api.put(Article));
router.delete('/:id', api.delete(Article));

module.exports = router;