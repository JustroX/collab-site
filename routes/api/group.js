var router = require('express').Router();
var Group = require('../../models/model_divider.js').model("Group");
var lib = require('./api-helper.js');
var api = require('./api-handler.js');


router.post('/', api.logged, api.post(Group));
router.get('/', api.list(Group) );
router.get('/:id', api.get(Group));
router.put('/:id', api.put(Group));
router.delete('/:id', api.delete(Group));


//ranks
router.get('/:id/ranks/', api.list_endpoint(Group , "ranks"));
router.post('/:id/ranks/', api.post_endpoint(Group , "ranks"));
router.get('/:id/ranks/:field_id', api.get_endpoint(Group , "ranks"));
router.put('/:id/ranks/:field_id', api.put_endpoint(Group , "ranks"));
router.delete('/:id/ranks/:field_id', api.delete_endpoint(Group , "ranks"));

//users
router.get('/:id/users/', api.list_endpoint(Group , "users"));
router.post('/:id/users/', api.post_endpoint(Group , "users"));
router.get('/:id/users/:field_id', api.get_endpoint(Group , "users"));
router.put('/:id/users/:field_id', api.put_endpoint(Group , "users"));
router.delete('/:id/users/:field_id', api.delete_endpoint(Group , "users"));

//users_pending
router.get('/:id/users_pending/', api.list_endpoint(Group , "users_pending"));
router.post('/:id/users_pending/', api.post_endpoint(Group , "users_pending"));
router.get('/:id/users_pending/:field_id', api.get_endpoint(Group , "users_pending"));
router.put('/:id/users_pending/:field_id', api.put_endpoint(Group , "users_pending"));
router.delete('/:id/users_pending/:field_id', api.delete_endpoint(Group , "users_pending"));


//badges_required
router.get('/:id/badges_required/', api.list_endpoint(Group , "badges_required"));
router.post('/:id/badges_required/', api.post_endpoint(Group , "badges_required"));
router.get('/:id/badges_required/:field_id', api.get_endpoint(Group , "badges_required"));
router.put('/:id/badges_required/:field_id', api.put_endpoint(Group , "badges_required"));
router.delete('/:id/badges_required/:field_id', api.delete_endpoint(Group , "badges_required"));



module.exports = router;