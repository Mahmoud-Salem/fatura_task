const mongoose = require('mongoose');
const Schema = mongoose.Schema;


/*

Blacklist model consists of :
    token ==> every refresh token not expired for logged out users.
    created_ad ==> to know when to delete the token after expiration date.

*/
const blacklistSchema = new Schema({
    token :{
        type :String,
    },
}, {timestamps: { createdAt: 'created_at'}});

const blacklistModel = mongoose.model('Blacklist', blacklistSchema);

module.exports = blacklistModel;