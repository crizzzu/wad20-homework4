const UserModel = require('../models/UserModel');
const jwt = require("../library/jwt");


module.exports = (request, response, next) => {

    // This is the place where you will need to implement authorization
    /*
        Pass access token in the Authorization header and verify
        it here using 'jsonwebtoken' dependency. Then set request.currentUser as
        decoded user from access token.
    */

    //i am not sure if this works or not, atleast no errors
    if (request.headers.authorization) { //https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
        let accessToken = request.headers.authorization;
        let verify = jwt.verifyAccessToken(accessToken);
        UserModel.getById(verify.id, (user) => {
            request.currentUser = user;
            request.accessToken = accessToken;
            next();
        });
    } else {
        // if there is no authorization header

        return response.status(403).json({
            message: 'Invalid token'
        });
    }
};