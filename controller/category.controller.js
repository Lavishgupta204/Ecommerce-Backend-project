/**
 * Controller for creating the category
 * 
 * POST localhost:8888/ecomm/api/v1/categories
 */
const category_model = require("../models/category.model")


exports.cerateNewCategory = async (req, res) => {
    // Read the req body

    // 1 -- Create the category obj
    const cat_data = {
        name : req.body.name,
        description : req.body.description
    }

    try {
        // 2 -- Insert into mongodb
       const category = await category_model.create(cat_data)
       return res.status(201).send(category);
    } catch (error) {
        console.log("Error while creating the category ", error);
        res.status(500).send("Sahi se category nahi bana hai");
    }

    // 3 -- return the response of the created category
}