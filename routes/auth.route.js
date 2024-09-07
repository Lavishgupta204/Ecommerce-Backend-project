/**
 * POST localhost:8888/ecomm/api/v1/auth/signup
 * (/ecomm/api/v1/auth/signup -- this is URI)
 * I need to intercept this
 */

const authController = require("../controller/auth.controller");
const authMW = require("../middlewares/auth.mw")


module.exports = (app) => {
    app.post("/ecomm/api/v1/auth/signup", [authMW.verifySignUpBody], authController.signup);

    
/**
 * routes for
 * POST localhost:8888/ecomm/api/v1/auth/singin
 */
app.post("/ecomm/api/v1/auth/signin", [authMW.verifySignInBody], authController.signin);

}
