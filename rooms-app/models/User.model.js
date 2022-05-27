const { Schema, model } = require("mongoose");


const userSchema = new Schema(
  { 
    email:{
      type:String,
      unique: true,
      required:true,
      lowercase:true,
      trim: true  //to remove the blank spaces at the beguining and end 
    },
    password: {
      type:String,
      unique: true
    },
    fullName: String,
    slackId: String,
    googleId: String,
    profilePic: String
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
  //TODO:create Like schema with reference to User and Event and add counter to Event. // for reference see this post https://stackoverflow.com/questions/62805858/facebook-like-feature-with-mongodb-schema-endpoint-design 
);

const User = model("User", userSchema);

module.exports = User;
