const except = require("chai").expect;
const sinon = require("sinon");
const User = require("../Models/User");
const AuthControllers = require("../Controllers/Auth");
const bcrypt = require("bcryptjs");
const Util = require("../Controllers/Util");
describe("Auth  Controller", () => {
  describe("#PostLogIn", () => {
    it("return an err with 500 status code if accessing the database fails ", (done) => {
      const req = {
        body: {
          email: "test@test.com",
          password: "test",
        },
      };
      sinon.stub(User, "findOne");
      User.findOne.throws();
      AuthControllers.postLogIn(req, {}, () => {}).then((result) => {
        except(result).to.be.an("error");
        except(result).to.have.property("statusCode", 500);
        done();
      });
      User.findOne.restore();
    });
    it("return an err with 500 status code if comparing password fails", (done) => {
      const req = {
        body: {
          email: "test@test.com",
          password: "test",
        },
      };
      sinon.stub(bcrypt, "compare");
      bcrypt.compare.throws();
      AuthControllers.postLogIn(req, {}, () => {}).then((result) => {
        except(result).to.be.an("error");
        except(result).to.have.property("statusCode", 500);
        done();
      });
      bcrypt.compare.restore();
    });
  });

  describe("#postSignUp", () => {
    it("throw an err with 500 status code if hashing password fails", (done) => {
      const req = {
        body: {
          userName: "test",
          email: "test@test.com",
          password: "test",
        },
      };
      sinon.stub(Util, "hash");
      Util.hash.throws();
      AuthControllers.postSignUp(req, {}, () => {}).then((result) => {
        except(result).to.be.an("error");
        done();
      });
      Util.hash.restore();
    });
    it("throw an err with 500 status code if creating a user fails", (done) => {
      const req = {
        body: {
          userName: "test",
          email: "test@test.com",
          password: "test",
        },
      };
      sinon.stub(User, "create");
      sinon.stub(Util, "hash");
      Util.hash.returns("");
      User.create.throws();
      AuthControllers.postSignUp(req, {}, () => {}).then((result) => {
        except(result).to.be.an("error");
        done();
      });
      User.create.restore();
      Util.hash.restore();
    });
  });
  describe("#postReset", () => {
    it("return an err with 500 status code if accessing the database fails ", (done) => {
      const req = {
        body: {
          email: "test@test.com",
        },
      };
      sinon.stub(User, "findOne");
      User.findOne.throws();
      AuthControllers.postReset(req, {}, () => {}).then((result) => {
        except(result).to.be.an("error");
        except(result).to.have.property("statusCode", 500);
        done();
      });
      User.findOne.restore();
    });
    it("return an err with 500 status code if generating the buffer fails", (done) => {
      const req = {
        body: {
          email: "test@test.com",
        },
      };
      sinon.stub(Util, "generateBuffer");
      Util.generateBuffer.throws();
      AuthControllers.postReset(req, {}, () => {}).then((result) => {
        except(result).to.be.an("error");
        except(result).to.have.property("statusCode", 500);
        done();
      });
      Util.generateBuffer.restore();
    });
  });

});
