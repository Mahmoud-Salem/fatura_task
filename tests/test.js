const app = require('../app');
const request = require("supertest");
const database = require("../database");
const bcrypt = require('bcrypt');
const client = require('../models/client');



// before all tests connect the db add some mock entried to db to test with.
beforeAll(async () => {

    await database.connectDB();
    const pass = await bcrypt.hash('ma',10);
    const pass2 = await bcrypt.hash('musk',10);
    const client_1 = {
        username: 'jack',
        password : pass,
        permissions : ['/addPermission','/permissions']
    }
    const client_2 = {
        username: 'elon',
        password : pass2,
        permissions : ['/permissions']
    }
    
   await client.create([client_1,client_2]);
  });

// after all tests remove mock entries and close db connection
afterAll(async () => {

    await client.remove({username: 'jack'});
    await client.remove({username: 'elon'});
    database.disconnectDB();
  });

  // login test
describe('login test', () => {
    it('login should return access and refresh token', async () => {
        // if client login is valid the response should return access and refresh tokens
        const res = await request(app)
            .post('/api/client/login')
            .send({
                username : 'jack',
                password : 'ma'
            });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
    })
  })

  // refresh token test
  describe('login refresh test', () => {
    it('should refresh access token', async () => {
        // if refresh token present the response should return a new access token
        const login = await request(app)
            .post('/api/client/login')
            .send({
                username : 'jack',
                password : 'ma'
            });
        const refresh = await request(app)
            .get('/api/client/refresh')
            .set({'refresh-token':login.body.refreshToken});
            
      expect(refresh.statusCode).toBe(200);
      expect(refresh.body).toHaveProperty('accessToken');
    })
  })

  // client logout test
  describe('login logout test', () => {
    it('logout and put refresh token on blacklist', async () => {
        // when requested with refresh token the response has access and refrestoken to null
        const login = await request(app)
            .post('/api/client/login')
            .send({
                username : 'elon',
                password : 'musk'
            });
        const logout = await request(app)
            .get('/api/client/logout')
            .set({'access-token':login.body.accessToken, 'refresh-token':login.body.refreshToken});
        expect(logout.body).toHaveProperty('accessToken');
        expect(logout.body).toHaveProperty('refreshToken');

    })
  })
  // login permission
  describe('login permissions test', () => {
    it('show my permissions ', async () => {
        // route to show my permission a list of permissions should shown
        const login = await request(app)
            .post('/api/client/login')
            .send({
                username : 'jack',
                password : 'ma'
            });
        const permissions = await request(app)
            .get('/api/client/permissions')
            .set({'access-token':login.body.accessToken});
        expect(permissions.body).toHaveProperty('permissions');

    })
  })

  // add permission route
  describe('login add permission test', () => {
    it('add permission to another user', async () => {
        const login = await request(app)
            .post('/api/client/login')
            .send({
                username : 'jack',
                password : 'ma'
            });
        const add = await request(app)
            .post('/api/client/addPermission')
            .set({'access-token':login.body.accessToken})
            .send({
                username : 'elon',
                permission : '/addPermission'
            })
            // response message for success request
        expect(add.body.message).toBe('permission given successfully');

    })
  })
