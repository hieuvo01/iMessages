const jwt = require("jsonwebtoken");

const middlewareController = {
	// verify token
	verifyToken: (req, res, next) => {
		const token = req.headers.token;
		if (token) {
			const accessToken = jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, user) => {
				if (err) {
					res.status(403).json("Token is not valid!!!");
				}
				req.user = user;
				next();
			})
		} else {
			res.status(401).json("You are not authenticated");
		}
	}
}

module.exports = middlewareController;