
const jwt = require('jsonwebtoken');
const Blacklist = require('../models/blacklist');



// Function to verfiy loggedin client
exports.isLoggedIn = (req, res, next) => {
    // get access token
    var token = req.get('access-token');
    if(token){
        // if token is present check if token is valid
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if(err){
                // if token expired notify the service to try to refresh their token or login again
                return res.status(404).json({success : false ,message: 'Your session has expired'});
            }
            else{
                // checking completed add client data to body and go to the service controller
                req.body.client = decoded.client ;
                next();
            }
        })
    }
    // not loggedin if there is no token
    else return res.status(404).json({success : false ,message: 'Not logged in'});
}


// refresh token function
exports.refreshToken = (req, res) => {
    var token = req.get('refresh-token');
    // get refresh token
    if(token)
    {
        // check if refresh token is on blacklist -- Whether a loggedout user trying to use the token again before expiration
        Blacklist.findOne({token: token})
        .then(found =>{
            if(found){
                console.log(found);
                // if token found in blacklist return not logged in
                return res.status(404).json({success : false ,message: 'Not logged in'});
            }
            else {
                // verify refresh token and generate a new access token for the client
                jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
                    if(err){
                        console.log("refresh token ",err);
                        return res.status(404).json({success : false ,message: 'Not logged in'});
                    }
                    else{
                        const accessToken = jwt.sign({decoded}, process.env.SECRET_KEY, { expiresIn: '5h'});
                        res.status(200).json({accessToken});
                    }
                })
            }
        })
        .catch(err => {
            console.log("refresh token error :", err);
            res.status(500).json({success:false, message:"Internal server error !!"});
        });

    }
    else {
        res.status(404).json({success : false ,message: 'Not logged in '});
    }
}


// check for permission for a specific service -- Whether this client has this service in their permissions
exports.permissable = (req, res, next) => {

    if(req.body.client.permissions.includes(req.path))
        next();
    else return res.status(404).json({success : false ,message: 'You do not have access to this'});
    
}