const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const bcrypt = require('bcrypt');
const usersModel = require('../../models/usersModel');
const authorizationHelpers = require('../../helpers/authorization');
const sessionsModel = require('../../models/sessionsModel');
const jwt = require('jsonwebtoken');

describe("Authorization helpers", () => {
    describe("#verifyUser func", () => {

        afterEach(() => sinon.restore())

        it('should return error if user not found', function (done) {
            sinon.stub(usersModel, 'getUsersData').returns(Promise.resolve({users: []}));

            const response = {status: function () {return this}, send: function ()  {return this}};
            let sendSpy = sinon.spy(response, 'send');
            let setStatusSpy = sinon.spy(response, 'status');

            authorizationHelpers.verifyUser(response, "abc", 123456)
                .then(() => {
                    expect(setStatusSpy).to.have.been.calledWith(400);
                    expect(sendSpy).to.have.been.calledWith({error: "The user does not exist!"});
                    done();
                })
                .catch((err) => done(err))
        });
        it('should create session if passwords match', function (done) {

            const response = {status: function () {return this}, send: function ()  {return this}};
            let sendSpy = sinon.spy(response, 'send');
            let setStatusSpy = sinon.spy(response, 'status');

            sinon.stub(usersModel, 'getUsersData').returns(Promise.resolve({users: [{name: "test", password: 12345}]}));
            sinon.stub(bcrypt, 'compare').returns(Promise.resolve(true));
            sinon.stub(jwt, 'sign').returns('test');
            sinon.stub(sessionsModel, 'writeSession').returns(Promise.resolve({accessToken: "test", refreshToken: 'test',
                userId: 1}))

            authorizationHelpers.verifyUser(response, 'test', 'test')
                .then(() => {
                    expect(setStatusSpy).to.have.been.calledWith(201);
                    expect(sendSpy).to.have.been.calledWith({accessToken: "test", refreshToken: 'test',
                        userId: 1});
                    done()
                })
                .catch((err) => {
                    done(err)
                })
        });
        it('should return error if passwords does not match', function (done) {
            const response = {status: function () {return this}, send: function ()  {return this}};
            let sendSpy = sinon.spy(response, 'send');
            let setStatusSpy = sinon.spy(response, 'status');

            sinon.stub(usersModel, 'getUsersData').returns(Promise.resolve({users: [{name: "test", password: 12345678}]}));
            sinon.stub(bcrypt, 'compare').returns(Promise.resolve(false));
            sinon.stub(jwt, 'sign').returns('test');
            sinon.stub(sessionsModel, 'writeSession').returns(Promise.resolve({accessToken: "test", refreshToken: 'test',
                userId: 1}))

            authorizationHelpers.verifyUser(response, 'test', 'test')
                .then(() => {
                    expect(setStatusSpy).to.have.been.calledWith(400);
                    expect(sendSpy).to.have.been.calledWith({error: "Incorrect password!"});
                    done()
                })
                .catch((err) => {
                    done(err)
                })
        });
    });

    describe("#postUsers function", () => {
        afterEach(() => sinon.restore());
        it('should create new user if name & password are valid', function (done) {
            const response = {status: function () {return this}, send: function () {return this}};
            let sendSpy = sinon.spy(response, 'send');
            let setStatusSpy = sinon.spy(response, 'status');

            sinon.stub(usersModel, 'getUsersData').returns(Promise.resolve({users: [{name: "test", password: "test", id: 1}]}));
            sinon.stub(bcrypt, 'hash').returns(Promise.resolve('test'));
            sinon.stub(usersModel, 'addUser').returns(Promise.resolve({user: {name: "test", password: 'test', id: 2}}));

            authorizationHelpers.postUsers(response, 'test', 'test')
                .then(() => {
                    expect(setStatusSpy).to.have.been.calledWith(202);
                    expect(sendSpy).to.have.been.calledWith({name: "test", password: 'test', id: 2});
                    done()
                })
                .catch(err => done(err))
        });
    })
})