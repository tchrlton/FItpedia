const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users/";
const User = require("../../src/db/models").User;
const sequelize = require("../../src/db/models/index").sequelize;

describe("routes : users", () => {

  beforeEach((done) => {

    sequelize.sync({force: true})
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });

  });

  describe("GET /users/sign_up", () => {

    it("should render a view with a sign up form", (done) => {
      request.get(`${base}sign_up`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Sign up");
        done();
      });
    });

  });

  describe("POST /users", () => {

        it("should create a new user with valid values and redirect", (done) => {
    
          const options = {
            url: base,
            form: {
              username: "noname123",
              email: "user@example.com",
              password: "123456789"
            }
          }
    
          request.post(options,
            (err, res, body) => {
    
              User.findOne({where: {email: "user@example.com"}})
              .then((user) => {
                expect(user.email).toBe("user@example.com");
                expect(user.id).toBe(1);
                expect(user).not.toBeNull();  
                done();
              })
              .catch((err) => {
                console.log(err);
                done();
              });
            }
          );
        });
    
        it("should not create a new user with invalid attributes and redirect", (done) => {
          request.post(
            {
              url: base,
              form: {
                username: "noname",
                email: "no",
                password: "123456789"
              }
            },
            (err, res, body) => {
              User.findOne({where: {email: "no"}})
              .then((user) => {
                expect(user).toBeNull();
                done();
              })
              .catch((err) => {
                console.log(err);
                done();
              });
            }
          );
        });
    
  });

  describe("GET /users/sign_in", () => {

    it("should render a view with a sign in form", (done) => {
      request.get(`${base}sign_in`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Sign in");
        done();
      });
    });

  });

  describe("GET /users/upgrade", () => {
    
    beforeEach((done) => {
       this.user;
       User.create({
         email: "starman@tesla.com",
         password: "Trekkie4lyfe",
         role: "standard"
       })
      .then( (res) => {
        this.user = res;
        done();
      });
     });

    it("should render a view with an upgrade form", (done) => {
      request.get(`${base}${this.user.id}/upgrade`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Upgrade Membership");
        done();
      });
    });

  });

  describe("POST /users/upgrade", () => {
    
    beforeEach((done) => {
      this.user;
      User.create({
        email: "starman@tesla.com",
        password: "Trekkie4lyfe",
        role:"standard"
      })
     .then( (res) => {
       this.user = res;
       done();
     });
    });

    it("should upgrade the user to premium membership", (done) => {
        request.post(`${base}${this.user.id}/upgrade`, (err, res, body) => {
          expect(err).toBeNull();
          User.findOne({
            where: { id: this.user.id }
          })
          .then((user) => {
            expect(user.role).toBe("premium");
            done();
          });
        });
    });

  });

  describe("POST /users/downgrade", () => {
    
    beforeEach((done) => {
      this.user;
      User.create({
        email: "starman@tesla.com",
        password: "Trekkie4lyfe",
        role: "premium"
      })
     .then( (res) => {
       this.user = res;
       done();
     });
    });

    it("should downgrade the user to standard membership", (done) => {
        request.post(`${base}${this.user.id}/downgrade`, (err, res, body) => {
          expect(err).toBeNull();
          User.findOne({
            where: { id: this.user.id }
          })
          .then((user) => {
            expect(user.role).toBe("standard");
            done();
          });
        });
    });

  });

});