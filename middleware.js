module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if(req.user.role != "admin") {
    req.flash("error", "Admin access required.");
    res.redirect("/");
  }
  next();
};

exports.isDeliveryMan = (req, res, next) => {
  if (req.user.role != "delivery-man") {
    req.flash("error", "Admin access required.");
    res.redirect("/");
  }
  next();
};
