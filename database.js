const mongoose = require('mongoose');


exports.connectDB= () =>{
    mongoose.connect(process.env.DATABASE_URL, function(err,client)
    {
        if(err)
        {
            console.log("Cannot connect to the database : ",err);
        }else {
            console.log("Connected to the database !! ");
        }
    });
}