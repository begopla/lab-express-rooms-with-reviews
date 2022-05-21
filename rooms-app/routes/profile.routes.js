const router = require("express").Router();


// const isAdmin = require("../middlewares/isAdmin")

const { isLoggedIn } = require("../middlewares/auth.middlewares.js");
const Room = require("../models/Room.model");
const User = require("../models/User.model");

//Load profile and retrieve all rooms owned //TODO: retrieve only owned rooms
router.get("/", isLoggedIn, async (req, res, next)=>{
	try {
		const rooms = await Room.find()
		res.render("profile",{ rooms});
	} catch (error) {
	  next(error);
}
});


module.exports = router;
