const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Please login first",
      });
    }

    if (req.user.role !== requiredRole) {
      return res.status(403).json({
        message: "Access denied. Admin permission required.",
        userRole: req.user.role,
        requiredRole: requiredRole,
      });
    }

    next();
  };
};

export default roleMiddleware;
