const mongoose = require('mongoose');
var db ;

exports.connectDB= () =>{
    mongoose.connect(process.env.DATABASE_URL)
    .then(connection =>{
        console.log("Connected to the database !! ");
        db = connection ;
    })
    .catch(err => {
        console.log("Cannot connect to the database : ",err);
    });
}


exports.disconnectDB=() =>{
    db.disconnect()

}