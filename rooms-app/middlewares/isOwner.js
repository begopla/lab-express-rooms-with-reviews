// function isRoomOwner async(req,res,next){
// const { id }= req.params;
// const roomDetails = await Room.findById(id);
// const roomOwner = await roomDetails.populate('owner');
// const roomOwnerId = roomOwner.owner._id.valueOf();
// const currentUserId =req.session.currentUser._id;

// if(roomOwnerId ===currentUserId){
//   next();
// }else{
//   res.redirect("rooms/allrooms")
// }

// }

// module.exports = {
//     isRoomOwner
//   };

