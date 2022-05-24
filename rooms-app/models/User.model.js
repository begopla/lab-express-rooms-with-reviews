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
);

const User = model("User", userSchema);

module.exports = User;
