const mongoose = require('mongoose');

/**
 * name
 * password
 * email
 * userType
 */
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    userId : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
        // unique : true,
    },
    email : {
        type : String,
        required : true,
        lowercase : true,
        minLength : 10,
        unique : true
    },
    userType : {
        type : String,
        required : true,
        default : "CUSTOMER",
        enum : ["CUSTOMER", "ADMIN"]
    }
}, {timestamp : true, versionKey : false});

module.exports = mongoose.model("User", userSchema)