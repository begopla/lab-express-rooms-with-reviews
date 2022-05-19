module.exports = {
    isLoggedIn: (req, res, next) => {
      if (req.session.currentUser) {
        next();
      } else {
        res.redirect("/auth/login");
      }
    },
    isLoggedOut: (req, res, next) => {
        if (req.session.currentUser) {
            return res.redirect("/profile");
        }
        next();
    },
  };