const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const uploader = require('../config/cloudinary.config');
const res = require("express/lib/response");
const SALT_FACTOR = 12;
const { isLoggedOut } = require("../middlewares/auth.middlewares.js");

const router =require("express").Router();

router.get('/signup',isLoggedOut,(req, res, next) => {
    res.render('auth/signup');
});

router.post('/signup',isLoggedOut ,async (req, res, next) =>{
   const { email, password, fullName, slackId, googleId } =req.body;
   if(!email ||!password){
       return res.render('auth/signup',{errorMessage: `Your password or email are not valid`})
   }
   const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/

   if (!regex.test(password)) {
		return res.render("auth/signup", {
			errorMessage:
				"Password needs to be 8 char long, including lower/upper case and a digit",
		});
    }

    const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
    if (!emailRegex.test(email)) {
     res.render("auth/signup", { signUpErr: "Please present a valid email" });
     return;
    }
   
   try {
     //Creck if user is unser name of email is unique(already exist in DB)
       const foundUser = await User.findOne({ email });
       if(foundUser){
        return res.render('auth/signup', {
          errorMessage: "Email already in use"
        });
      }
      //Encrypt password
      const hashedPassword = bcrypt.hashSync(password, SALT_FACTOR);
      
      //Create user in DB
     const createdUser = await User.create({
        email, 
        password: hashedPassword,
        fullName, 
        slackId,
        googleId
   });
   console.log('I have created a user');
   const objectUser = createdUser.toObject();
   delete objectUser.password;
   req.session.currentUser = objectUser;
   res.redirect('/auth/login');
   
}catch (error) {
       next(error)
   }
});

router.get("/login",isLoggedOut, (req,res) =>{
    res.render("auth/login");
});

router.post("/login", isLoggedOut,async (req, res, next)=>{
    const { email, password } =req.body;
    
    if (!email || !password) {
		return res.render("auth/signin", {
			errorMessage: "Please provide an email and a a password",
		})
	}

	try {
		const foundUser = await User.findOne({ email })

		if (!foundUser) {
			return res.render("auth/login", {
				errorMessage: "Wrong credentials",
			});
		}

		const checkPassword = bcrypt.compareSync(password, foundUser.password);
		if (!checkPassword) {
			res.render("auth/login", {
				errorMessage: "Wrong credentials",
			});
		}

		const objectUser = foundUser.toObject();
		delete objectUser.password;
		req.session.currentUser = objectUser;

		return res.redirect("/profile");
	} catch (e) {
		next(e);
	}
});

router.get("/logout", (req, res, next) => {
    req.session.destroy();
    res.redirect("/auth/login");
  });

module.exports = router;