const router = require("express").Router();

const async = require("hbs/lib/async");
const { model } = require("mongoose");
const { isLoggedIn } = require("../middlewares/auth.middlewares.js");
const Room = require("../models/Room.model");
const User = require("../models/User.model");
const Review = require("../models/Review.model")
const isRoomOwner = require("../middlewares/isOwner");
const { findById } = require("../models/Room.model");


//Load all available rooms
router.get("/allrooms",  async (req, res, next)=>{
	try {
		const rooms = await Room.find()
		res.render("rooms/all-rooms",{ rooms});
	} catch (error) {
	  next(error);
}
});


router.get("/create",isLoggedIn, async (req, res, next)=>{
    try {
         res.render("rooms/create-room" );
    } catch (error) {
        
    }
    });
    router.post("/create",isLoggedIn, async(req,res,next)=>{
        try {
            const user =req.session.currentUser;
            const { name, description, imageUrl} =req.body;
            const newRoom =  await Room.create({
                 name,
                 description,
                 imageUrl,
                 owner:user._id,
            });
            res.redirect("/profile");
        } catch (error) {
            next(error)
        }
    });
    

//Edit Room details
router.get("/:id/edit", isLoggedIn, async(req,res,next)=>{
    try {
        const{ id } =req.params;
        const roomDetails = await Room.findById(id);
        const roomOwner = await roomDetails.populate('owner');
        const roomOwnerId = roomOwner.owner._id.valueOf();
        if(req.session.currentUser._id === roomOwnerId){
        console.log(`You're the room owner please edit it`)
        res.render("rooms/edit-room", roomDetails );
        }else{
        res.render("rooms/room-detail",{errorMessage: "You are not the owner of the room"});
        }
        

    } catch (error) {
        next(error);       
    }
});

router.post("/:id/edit", isLoggedIn,async(req, res, next)=>{
    try {
        const { id } = req.params;
        const {name, description, imageUrl} = req.body;
        await Room.findByIdAndUpdate(id, {name, description, imageUrl}, {new: true});
        res.redirect("/");
      } catch (error) {
        next(error);
        res.render("rooms/allrooms");
      }
})

//Delete room


router.post("/:id/delete", async (req,res,next) =>{
    try {
        
       
        const{ id } =req.params;
        const roomDetails = await Room.findById(id);
        const roomOwner = await roomDetails.populate('owner');
        const roomOwnerId = roomOwner.owner._id.valueOf();
        if(req.session.currentUser._id === roomOwnerId){
        console.log(`You're the room owner, please delete it`)
        await Room.findByIdAndDelete(id);
        res.redirect("/");
        }else{
            res.render("/",{errorMessage: "You don't have delete rights"});
        }
        res.redirect("/");
    } catch (error) {
        next(error);
    }
});

//Adding reviews (get/post)

router.get("/:id/add-review", isLoggedIn, (req, res, next)=>{
    res.render("rooms/newComment", {_id: req.params.id})
});

router.post("/:id/add-review",  async (req,res,next)=>{
   try {
    const { id } = req.params;
    
   
    const {comment} = req.body;
    const user = req.session.currentUser._id;

    const newReview = await Review.create({user, comment, id}); 
    // const allreviewsbyUser = await Review.find({user})
    // console.log(allreviewsbyUser);

    const newRoomDetail = await Room.findByIdAndUpdate(id,{reviews:newReview});//TODO: I am only updating the Room with the last review created but not all of them

   
    
   // await Room.findByIdAndUpdate(id, newReview)
    
    res.redirect('/');
   } catch (error) {
      next(error);
   }
});

//Load room detail

router.get("/:id", async(req,res,next)=>{
    try {
        const{ id } =req.params;
        
        const roomDetails = await Room.findById(id)
      
        const allReviews = await roomDetails.populate('reviews');
    
        const arrayOfReviews =allReviews.reviews;
        console.log(arrayOfReviews)

        res.render("rooms/room-detail", {roomDetails, arrayOfReviews, currentUser: req.session.currentUser} );
    } catch (error) {
        next(error);       
    }
});

//Logging out

router.get("/auth/logout", (req, res, next) => {
    req.session.destroy();
    res.redirect("/auth/login");
  });





module.exports =router;