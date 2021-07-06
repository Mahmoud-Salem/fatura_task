
const Client = require('../models/client');
const jwt = require('jsonwebtoken');
const Blacklist = require('../models/blacklist');
const bcrypt = require('bcrypt');
const cron = require('node-cron');


/*
    Cron job to update blacklist collections
    -- every day at midnight check all tokens
        -- if token has passed more than 5 days which is the expiration date of the refresh token 
            -- delete this token from collection

*/
cron.schedule('59 23 * * *', () => {

    console.log('update blacklist');
       Blacklist
        .find({
                created_at: {
                    $lte: new Date(new Date()- 5 * 24 * 60 * 60 * 1000)
                    } 
            })
        .then(tokens => {
            const promises = [];
            tokens.forEach(token => 
                {
                    promises.push(Blacklist.remove({_id: token._id}).exec());
                });
            Promise.all(promises)
            .then(resp => console.log("Blacklist updated successfully !!"))
            .catch(err => console.log(err));
        })
});


// Client login controller
exports.loginClient = (req, res) => {
    // find a client with this username
    Client.findOne({username: req.body.username, isDeleted : false})
    .then(client => {
        if(client){
            // if client found verify password with the saved hashed password in the db
            bcrypt.compare(req.body.password, client.password, (err, result) => {
                delete client.password;
                delete client.isDeleted;
                if(err)
                    res.status(500).json({success:false, message:"Internal server error !!"});
                if(result){
                    // return accesstokena and refresh token for client to authenticate with
                    const accessToken = jwt.sign({client}, process.env.SECRET_KEY, { expiresIn: '5h'});
                    const refreshToken = jwt.sign({client}, process.env.SECRET_KEY, { expiresIn: '3d'});
                    res.status(200).json({client, accessToken, refreshToken});
                }
                else res.status(404).json({success:false, message:"Wrong username/password combination"});
            });
            }
        else res.status(404).json({success:false, message:"This username does not exist"});
    })
    .catch(err => {
        console.log("login error :", err);
        res.status(500).json({success:false, message:"Internal server error !!"});
    })
}


// client logout route
exports.clientLogout = (req, res, next) => {
    // client logout require a valid refresh token with the request

    var refreshToken = req.get('refresh-token');
    if(refreshToken)
    {
        // save the refresh token in the db for enforcing invalidating this session
        const blocked = {
            token : refreshToken,
        };
        Blacklist.create(blocked)
        .then(resp =>{
            res.status(200).json({ success: true, message: 'Logged Out Successfully', accessToken: null, refreshToken:null });
        })
        .catch(err => {
            console.log("logout error :", err);
            res.status(500).json({success:false, message:"Internal server error !!"});
        });
    }else {
        res.status(404).json({success:false, message:"Refresh token required"});
    }
}



// controller for user to add permission to another user
exports.addPermission = (req, res, next) => {

    // check the username and permission is existing in the request body
    if( !req.body.username || !req.body.permission ){
        res.status(400).json({success:false,message:"bad request !!"});
    }
    else {
        // update this client permission
        Client.updateOne({username : req.body.username}, {$addToSet: {permissions : req.body.permission}})
        .then (
            resp => res.status(200).json({success:true,message:"permission given successfully"})
        )
        .catch (err => {
            console.log("logout error :", err);
            res.status(500).json({success:false, message:"Internal server error !!"});
        });
    }

}

// controller to get clients own permissions
exports.getPermissions = (req, res, next) => {

    res.status(200).json({success:true, permissions: req.body.client.permissions})

}

