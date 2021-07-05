const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blacklistSchema = new Schema({
    token :{
        type :String,
    },
}, {timestamps: { createdAt: 'created_at'}});

const blacklistModel = mongoose.model('Blacklist', blacklistSchema);

module.exports = blacklistModel;