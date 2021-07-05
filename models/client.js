const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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