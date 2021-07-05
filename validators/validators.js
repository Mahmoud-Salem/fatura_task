
const jwt = require('jsonwebtoken');
const Blacklist = require('../models/blacklist');



exports.isLoggedIn = (req, res, next) => {
    var token = req.get('access-token');
    if(token){
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if(err){
                return res.status(404).json({success : false ,message: 'Your session has expired'});
            }
            else{
                req.body.client = decoded.client ;
                next();
            }
        })
    }
    else return res.status(404).json({success : false ,message: 'Not logged in'});
}


exports.refreshToken = (req, res) => {
    var token = req.get('refresh-token');

    if(token)
    {
        Blacklist.findOne({token: token})
        .then(found =>{
            if(found){
                console.log(found);
                return res.status(404).json({success : false ,message: 'Not logged in'});
            }
            else {
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


exports.permissable = (req, res, next) => {

    if(req.body.client.permissions.includes(req.path))
        next();
    else return res.status(404).json({success : false ,message: 'You do not have access to this'});
    
}