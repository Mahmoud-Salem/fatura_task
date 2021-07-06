const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*

Client model consists of :
username ==> unique username for every client.
password ==> required password
permission ==> list of permissions for this client
isDeleted ==> whether if this client is deleted or not 

*/
const clientSchema = new Schema({
    username :{
        type :String,
        required : true,
        unique : true
    },
    password: {
        type: String,
        required: true
    },
    permissions :[{
        type : String,
    }],
    isDeleted: {
        type : Boolean,
        default : false
    }
});

const clientModel = mongoose.model('Client', clientSchema);

module.exports = clientModel;