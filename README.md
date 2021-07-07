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

### Overview
    To generate authentication JWT is better than sessions on restful services as it stateless and also it does not need storage.
    However, the problem with JWT is when the user logout we cannot revoke the token until its expired so to overcome this problem
    the system uses short lived access token and a longlived refresh token, user can use the access token for his authentication and
    when the access token expire he can use the refresh token to get a new access token. But now the problem with longlived refresh token
    on logout, the system overcome this problem by having a blacklist of loggedout refreshtoken to be stored until it expiration date
    which a cron job is set to always update the blacklist.

    For the authorization part we have a list of permissions stored for every user to know which services can this user use.
    on calling a service we simply check if this service is in this client set of permissions to know whether he will able to 
    use it or not.

### Authentication 

* **Login :** 
    * **The service checks the username and password to an existing ones on the database**
    * **Then it creates a short-lived (JWT) access token for verification and a long-lived (JWT) refresh token for refreshing sessions**
* **Logout :** 
    * **The service return a null for access token and refresh token to be set on the front-end or the party who uses the service**
    * **Then it stores the long-lived (JWT) refresh token in a blacklist to ensure that this user cannot continue this session**
    * **Every Day a cron job runs to update the blacklist to remove refresh tokens that has expired**

### Authorization 
* **Permissions :** 
    * **Every client has a list of permissions stored with the client data in the database**
    * **When requesting a service a validator function run before to check whether this service can be provided for this client or not**



    ![GitHub Logo](/use_case.png)

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

## Future Works
    If the set of permissions is known for specific actions or services, we can store it in a better way in easily accessing 
    and checking. For example if we can extend the user to have a role and permissions where a certain role come with some predefined permissions
    and some extra permissions to be stores if needed.
    There are different situations for authorization. One for expample is a company where every employee in a department have access to some actions.
    Another example is a service where regular user has some permissions and a premium user has extra permissions in addition to the ones of the regular user.
    