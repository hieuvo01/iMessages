const jwt = require("jsonwebtoken");

const middlewareController = {
	verifyToken: (req, res, next) => {
		const token = req.headers.token;
		if (token) {
			try {
				const user = jwt.verify(token, process.env.JWT_ACCESS_KEY);
				req.user = user;
				next();
			} catch (err) {
				res.status(403).json("Token is not valid!!!");
			}
		} else {
			res.status(401).json("You are not authenticated");
		}
	}
};

module.exports = middlewareController;