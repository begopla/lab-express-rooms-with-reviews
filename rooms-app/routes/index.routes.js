const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.use('/auth', require('./auth.routes'));
router.use('/profile',require('./profile.routes'));
router.use('/rooms',require('./room.routes'));
module.exports = router;
