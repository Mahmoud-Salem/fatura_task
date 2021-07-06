const app = require("./app");
const database = require("./database");

// Connect to the database.
database.connectDB();

// Get port from env vars.
var port = (process.env.PORT)? process.env.PORT : 8080 ;
// run server.
app.listen(port,  function(){
  console.log('Server started in '+ port);
});