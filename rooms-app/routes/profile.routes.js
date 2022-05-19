const router = require("express").Router();

// const isAdmin = require("../middlewares/isAdmin")

const { isLoggedIn } = require("../middlewares/auth.middlewares.js")


router.get("/", isLoggedIn, (req, res) => {
		res.render("profile");
});



module.exports = router;
