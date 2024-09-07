const user_model = require("../models/user.model");
const jwt = require('jsonwebtoken');
const authConfig = require("../configs/auth.config")

/**
 * create a mw will check if the request body is proper and correct 
*/

const verifySignUpBody = async (req, res, next) => {
    try {
        // check for the name
        if (!req.body.name) {
            return res.status(400).send("Failed! Name was not provided in request body");
        }

        // check for the userId
        if (!req.body.userId) {
            return res.status(400).send("Failed! UserId was not provided in request body");
        }

        // check for the email
        if (!req.body.email) {
            return res.status(400).send("Failed! Email was not provided in request body");
        }

        // check if the user with the same userId is already present
        const user = await user_model.findOne({userId : req.body.userId})
        if (user){
            return res.status(400).send("Failed ! user with same userId is already present")
        }

        next()

    } catch (error) {
        console.log("Error while validating the request object", error);
        res.status(500).send({
            msg : "Error while validating the request body"
        })
    }
}

const verifySignInBody = async (req, res, next) => {
    console.log("Verify sign-in body middleware triggered");  // Log middleware call
    if(!req.body.userId){
        return res.status(400).send("userId is not provided")
    }
    if(!req.body.password){
        return res.status(400).send("Password is not provided")
    }
    next();
};

const verifyToken = async (req, res, next) => {
    // We will check if the token is present in the header here
    const token = req.headers['x-access-token'];
    
    if(!token){
        return res.status(403).send("No token found : UnAuthorized")
    }

    // If the valid token
    jwt.verify(token, authConfig.secret, async (err, decoded) => {
        if(err){
            return res.status(401).send("Unsuthorized")
        }

        const user = await user_model.findOne({userId : decoded.id});

        if(!user){
            return res.status(400).send("Unauthorized, this user for this token doesn't exist")
        }
        // Set user info in the req body
        req.user = user

        next();
    });
    
    // then move to the next step
};

const isAdmin = (req, res, next) => {
    const user = req.user;
    if (user && user.userType === "ADMIN") {
        next()
    }else{
        return res.status(403).send("Only ADMIN user are allowed to access this endpoint");
    }
}

module.exports = {
    verifySignUpBody : verifySignUpBody,
    verifySignInBody : verifySignInBody,
    verifyToken : verifyToken,
    isAdmin : isAdmin
}