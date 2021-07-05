
const Client = require('../models/client');
const jwt = require('jsonwebtoken');
const Blacklist = require('../models/blacklist');
const bcrypt = require('bcrypt');
const cron = require('node-cron');


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


exports.loginClient = (req, res) => {
    Client.findOne({username: req.body.username, isDeleted : false})
    .then(client => {
        if(client){
            bcrypt.compare(req.body.password, client.password, (err, result) => {
                delete client.password;
                delete client.isDeleted;
                if(err)
                    res.status(500).json({success:false, message:"Internal server error !!"});
                if(result){
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


exports.clientLogout = (req, res, next) => {

    var refreshToken = req.get('refresh-token');
    if(refreshToken)
    {
        const blocked = {
            token : refreshToken,
        };
        Blacklist.create(blocked)
        .then(resp =>{
            res.status(200).json({ success: true, message: 'Logged Out Successfully', accesstoken: null, refreshToken:null });
        })
        .catch(err => {
            console.log("logout error :", err);
            res.status(500).json({success:false, message:"Internal server error !!"});
        });
    }else {
        res.status(404).json({success:false, message:"Refresh token required"});
    }
}



exports.addPermission = (req, res, next) => {

    if( !req.body.username || !req.body.permission ){
        res.status(400).json({success:false,message:"bad request !!"});
    }
    else {

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

exports.getPermissions = (req, res, next) => {

    res.status(200).json({success:true, permissions: req.body.client.permissions})

}

