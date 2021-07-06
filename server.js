const app = require("./app");
const database = require("./database");


database.connectDB();

var port = (process.env.PORT)? process.env.PORT : 8080 ;
app.listen(port,  function(){
  console.log('Server started in '+ port);
});