# fatura_task

This project aims to build a service to be used for authentication and authorization of clients.

## Project Setup 

### First run this command to install dependencies
```
    npm install
```

### To run the server you can use one of these 3 commands 
```
    node server.js
    npm start
    nodemon
```

### To run tests 
```
    npm test
```

## System Design

### Authentication 
* Login : 
    * **The service checks the username and password to an existing ones on the database**
    * **Then it creates a short-lived (JWT) access token for verification and a long-lived (JWT) refresh token for refreshing sessions**
* Logout : 
    * **The service return a null for access token and refresh token to be set on the front-end or the party who uses the service**
    * **Then it stores the long-lived (JWT) refresh token in a blacklist to ensure that this user cannot continue this session**
    * **Every Day a cron job runs to update the blacklist to remove refresh tokens that has expired**

### Authorization 
* Permissions : 
    * **Every client has a list of permissions stored with the client data in the database**
    * **When requesting a service a validator function run before to check whether this service can be provided for this client or not**

## API Routes
### Login Route
```
    Route : /api/client/login
    Method : POST
    Body : {username, password}
    Response :
        200 success : {client, accesstoken, refreshtoken}
        400 Fail : wrong credentials
        500 Fail : Internal server Error
```
### Logout Route
```
    Route : /api/client/logout
    Method : GET
    Headers : {refresh-token,access-token}
    Response :
        200 success : { accesstoken:null, refreshtoken:null}
        400 Fail : validation error
        500 Fail : Internal server Error
```
### Refresh Token Route
```
    Route : /api/client/refresh
    Method : GET
    Headers : {refresh-token}
    Response :
        200 success : { accesstoken}
        400 Fail : validation error
        500 Fail : Internal server Error
```

### Add Permission Route
```
    Route : /api/client/addPermission
    Method : GET
    Headers : {access-token}
    Body : {username,permission}
    Response :
        200 success : {success:true,message:"permission given successfully"}
        400 Fail : validation error
        500 Fail : Internal server Error
```
### Add Permission Route
```
    Route : /api/client/addPermission
    Method : POST
    Headers : {access-token}
    Body : {username,permission}
    Response :
        200 success : {success:true,message:"permission given successfully"}
        400 Fail : authentication || authorization error
        500 Fail : Internal server Error
```

### View Permissions Route
```
    Route : /api/client/permissions
    Method : GET
    Headers : {access-token}
    Response :
        200 success : {permissions}
        400 Fail : authentication || authorization error
        500 Fail : Internal server Error
```
