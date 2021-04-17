const request = require("supertest");
const app = require("../app");
const { user } = require("../models");

let authenticationToken;
const deleteAll = async () => {
  await user.deleteMany();
};

deleteAll();

// Auth test
describe("Auth Test", () => {
  describe("/signup POST", () => {
    it("It should make user and get the token", async () => {
      const res = await request(app).post("/signup").send({
        email: "ryan@gmail.com",
        password: "Ryan1234!!",
        confirmpassword: "Ryan1234!!",
        fullname: "Ryan D",
        username: "ryanian",
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Success");
      expect(res.body).toHaveProperty("token");
    });
  });

  // Test the error
  // Email already used
  describe("/signup POST", () => {
    it("It should error when make user", async () => {
      const res = await request(app).post("/signup").send({
        email: "ryan@gmail.com",
        password: "Ryan1234!!",
        confirmpassword: "Ryan1234!!",
        fullname: "Ryan",
        username: "ryanian",
      });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("User can't be created");
    });
  });

  // Wrong email format
  describe("/signup POST", () => {
    it("It should error when make user", async () => {
      const res = await request(app).post("/signup").send({
        email: "ryan",
        password: "Ryan1234!!",
        confirmpassword: "Ryan1234!!",
        fullname: "Ryan",
        username: "ryanian",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Please input valid email");
    });
  });

  // Wrong fullname format
  describe("/signup POST", () => {
    it("It should error when make user", async () => {
      const res = await request(app).post("/signup").send({
        email: "ryan@gmail.com",
        password: "Ryan1234!!",
        confirmpassword: "Ryan1234!!",
        fullname: "12345",
        username: "ryanian",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Please input valid letters");
    });
  });

  // Wrong username format
  describe("/signup POST", () => {
    it("It should error when make user", async () => {
      const res = await request(app).post("/signup").send({
        email: "ryan@gmail.com",
        password: "Ryan1234!!",
        confirmpassword: "Ryan1234!!",
        fullname: "ryan",
        username: "12345",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Please input valid letters");
    });
  });
  // Wrong password format
  describe("/signup POST", () => {
    it("It should error when make user", async () => {
      const res = await request(app).post("/signup").send({
        email: "ryan@gmail.com",
        password: "Ryan1234",
        confirmpassword: "Ryan1234",
        fullname: "Ryan D",
        username: "ryanian",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual(
        "Password must have minimum length of 8 characters with minimum 1 lowercase character, 1 uppercase character, 1 number and 1 symbol"
      );
    });
  });
  // Wrong password confirmation
  describe("/signup POST", () => {
    it("It should error when make user", async () => {
      const res = await request(app).post("/signup").send({
        email: "ryan@gmail.com",
        password: "Ryan1234!!",
        confirmpassword: "Ryan1234",
        fullname: "Ryan D",
        username: "ryanian",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual(
        "Password confirmation must be the same with password"
      );
    });
  });

  // Login Success
  describe("/login POST", () => {
    it("It should make user login and get authentication_key (jwt)", async () => {
      const res = await request(app).post("/login").send({
        email: "ryan@gmail.com",
        password: "Ryan1234!!",
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Success");
      expect(res.body).toHaveProperty("token");

      authenticationToken = res.body.token;
    });
  });
  // Wrong password
  describe("/login POST", () => {
    it("It should fail to make user login and get authentication_key (jwt)", async () => {
      const res = await request(app).post("/login").send({
        email: "dodi@gmail.com",
        password: "dodi1234!!",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual(
        "Password must have minimum length of 8 characters with minimum 1 lowercase character, 1 uppercase character, 1 number and 1 symbol"
      );
    });
  });

  // User not existed
  describe("/login POST", () => {
    it("It should fail to make user login and get authentication_key (jwt)", async () => {
      const res = await request(app).post("/login").send({
        email: "tony@gmail.com",
        password: "Tony1234!!",
      });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Email not found");
    });
  });

  // Wrong email format
  describe("/login POST", () => {
    it("It should fail to make user login and get authentication_key (jwt)", async () => {
      const res = await request(app).post("/login").send({
        email: "ryan",
        password: "Ryan1234!!",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Please input valid email");
    });
  });

  // Wrong password format
  describe("/login POST", () => {
    it("It should fail to make user login and get authentication_key (jwt)", async () => {
      const res = await request(app).post("/login").send({
        email: "ryan@gmail.com",
        password: "Ryan1234",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual(
        "Password must have minimum length of 8 characters with minimum 1 lowercase character, 1 uppercase character, 1 number and 1 symbol"
      );
    });
  });
});

// Test User API
// Get their profile
describe("User Test", () => {
  describe("/user/:id GET", () => {
    it("User should be able to retrieve their profile", async () => {
      const login = await request(app).post("/login").send({
        email: "ryan@gmail.com",
        password: "Ryan1234!!",
      });
      
      authenticationToken = login.body.token ; 
      
      data = await user.findOne({ email : "ryan@gmail.com" });
      
      const res = await request(app)
        .get(`/user/${data._id}`)
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Success");
      expect(res.body).toHaveProperty("data");
    });
  });

  // Test the error
  // Wrong params id format
  describe("/user GET", () => {
    it("It should fail getting the user profile", async () => {
      const login = await request(app).post("/login").send({
        email: "ryan@gmail.com",
        password: "Ryan1234!!",
      });
      
      authenticationToken = login.body.token ; 
            
      const id_user = '6076981cf5c24b80f42d1ab4123'

      const res = await request(app)
        .get(`/user/${id_user}`)
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual(
        "User ID is not valid and must be 24 character & hexadecimal"
      );
    });
  });

  // Update user profile
  describe("/user/:id PUT", () => {
    it("User should be able to update their profile", async () => {
      const login = await request(app).post("/login").send({
        email: "ryan@gmail.com",
        password: "Ryan1234!!",
      });
      authenticationToken = login.body.token ; 

      let data = await user.findOne({ email : "ryan@gmail.com" });
      console.log(data)
      const res = await request(app)
        .put(`/user/${data._id}`)
        .send({
          fullname: "Fahmi A."
        })
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Success");
      expect(res.body).toHaveProperty("data");

    });
  });


});
