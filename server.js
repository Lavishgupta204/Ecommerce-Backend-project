// This will be the starting file of the project
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const serverConfig = require('./configs/server.config.js');
const db_config = require('./configs/db.config.js');
const user_model = require('./models/user.model.js');
const bcrypt = require('bcryptjs');


app.use(express.json()); // It is a middleware that helps to convert json format to js in output


// Connection with monogoDB
mongoose.connect(db_config.DB_URL)

const db = mongoose.connection

db.on("error", () => {
    console.log("Error while connecting to the mongoDB");
    
})
db.once("open", () => {
    console.log("Connected to mongoDB");
    init()
})

/**
 * create an admin user at the starting of the application
 * if not already present
 */

async function init(){
    try{
        let user = await user_model.findOne({userId : "admin"})
        if(user){
        console.log("Admin is already present");
        return
        }
    }catch(err){
    console.log("Error while reading the data ", err);
    }

    try {
        user = await user_model.create({
            name : "Lavish Kaushal",
            userId : "admin",
            email : "baniyalavish97@getMaxListeners.com",
            userType : "ADMIN",
            password : bcrypt.hashSync("Welcome@1",8)
        })
        console.log(`Admin has been created: ${user}`);
        
    } catch (error) {
        console.log("Error while creating admin ", error);
    }
}

//stich the route to the server
require("./routes/auth.route.js")(app) //here what we did calling routes and passing app obj; initialy we are just connecting route to the app and app to route
require("./routes/category.route.js")(app)

// start the server
app.listen(serverConfig.PORT, () => {
    console.log(`Server started at port ${serverConfig.PORT}`);
})
