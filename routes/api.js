/*********************

	Main API router

**********************/
var router = require('express').Router();

router.use('/article', require('./api/article.js'));
router.use('/badge', require('./api/badge.js'));
router.use('/challenge', require('./api/challenge.js'));
router.use('/guild', require('./api/guild.js'));
router.use('/module', require('./api/module.js'));
router.use('/post', require('./api/post.js'));
router.use('/submission', require('./api/submission.js'));
router.use('/user', require('./api/user.js'));
router.use('/invitation', require('./api/invitation.js'));

module.exports = router;