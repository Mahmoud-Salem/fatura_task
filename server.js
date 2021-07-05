const app = require("./app")
const mongoose = require('mongoose');
require('dotenv').config();



mongoose.connect(process.env.DATABASE_URL, function(err, client){
    if(client){
        console.log("Connected to the database");

    }else{
        console.log("Database connection error");
    }
  });



var port = (process.env.PORT)? process.env.PORT : 8080 ;
app.listen(port,  function(){
  console.log('Server started in '+ port);
});