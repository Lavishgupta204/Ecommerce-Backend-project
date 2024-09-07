/**
 * I need to write the controller / logic to register a user
 */

const bcrypt = require('bcryptjs')
const user_model = require("../models/user.model");
const jwt = require('jsonwebtoken');
const secret = require("../configs/auth.config");

exports.signup = async (req, res) => {
    /**
     * Logic to create the user
     */

    // 1. Read the request body
    const request_body = req.body;

    // 2. Insert the data in the Users Collection in MongoDB
    const userObj = {
        name : request_body.name,
        userId : request_body.userId,
        email : request_body.email,
        userType : request_body.userType,
        password : bcrypt.hashSync(request_body.password,8)
    }

    try {
        const user_created = await user_model.create(userObj)
        /**
         * return this user
         */

        const res_obj = {
            name : user_created.name,
            userId : user_created.userId,
            email : user_created.email,
            userType : user_created.userType,
            createdAt : user_created.createdAt,
            updatedAt : user_created.updatedAt
        }
        res.status(201).send(res_obj) //it means something has been successfully created

    } catch (error) {
        console.log("Error while registering the user", error);
        res.status(500).send({
            message : "Some error happened while registering the user"
        }) //500 it means that it is a internal server error
    }

    // 3. Return the response back to the user

}


exports.signin = async (req, res) => {
    try {
        // Check if the user id is present in the system
        console.log("Sign in request body:", req.body); // Check the incoming request data
        const user = await user_model.findOne({ userId: req.body.userId });
        console.log("User fetched from DB:", user);  // Log the fetched user data
        
        if (!user) {  // Correct null check
            return res.status(400).send({
                msg: "User id passed is not a valid user id"
            });
        }

        // Check if the password is correct
        const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).send({
                msg: "Wrong password passed"
            });
        }

        // Create a token with a TTL (Time To Live)
        const token = jwt.sign({ id: user.userId }, secret.secret, {
            expiresIn: 180  // 3 minutes
        });
        console.log("Generated token:", token);  // Log the generated token

        // Return the response with user data and access token
        res.status(200).send({
            name: user.name,
            userId: user.userId,
            email: user.email,
            userType: user.userType,
            accessToken: token
        });

    } catch (error) {
        console.error("Error during sign in:", error);
        res.status(500).send({
            msg: "Internal server error during sign in"
        });
    }
};
