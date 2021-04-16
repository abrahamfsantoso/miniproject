const request = require("supertest");
const app = require("../app");
const { user,pelanggan } = require("../models");

let authenticationToken;


const deleteAll = async () => {
  await user.deleteMany();
};

deleteAll();

describe("Auth Test", () => {
  describe("/auth/register POST", () => {
    it("It should make user and get the token", async () => {
      const res = await request(app).post("/auth/register").send({
        email: "abie@gmail.com",
        password: "Abie1234!!",
        confirmPassword: "Abie1234!!",
        name: "Abie",
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Success");
      expect(res.body).toHaveProperty("token");
    });
  });

  // Test the error
  describe("/auth/register POST", () => {
    it("It should error when make user", async () => {
      const res = await request(app).post("/auth/register").send({
        email: "abie@gmail.com",
        password: "Abie1234!!",
        confirmPassword: "Abie1234!!",
        name: "Abie",
      });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("User can't be created");
    });
  });

  describe("/auth/login POST", () => {
    it("It should make user login and get authentication_key (jwt)", async () => {
      const res = await request(app).post("/auth/login").send({
        email: "abie@gmail.com",
        password: "Abie1234!!",
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Success");
      expect(res.body).toHaveProperty("token");

      authenticationToken = res.body.token;
    });
  });
  // Wrong password
  describe("/auth/login POST", () => {
    it("It should fail to make user login and get authentication_key (jwt)", async () => {
      const res = await request(app).post("/auth/login").send({
        email: "dodi@gmail.com",
        password: "dodi1234!!",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Password must have minimum length of 8 characters with minimum 1 lowercase character, 1 uppercase character, 1 number and 1 symbol");
    });
  });
  // User not existed
  describe("/auth/login POST", () => {
    it("It should fail to make user login and get authentication_key (jwt)", async () => {
      const res = await request(app).post("/auth/login").send({
        email: "tony@gmail.com",
        password: "Tony1234!!",
      });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Email not found");
    });
  });

});
    