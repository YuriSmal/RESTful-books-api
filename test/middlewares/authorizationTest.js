const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const usersModel = require('../../models/usersModel');
const authorization = require('../../middlewares/authorization');
const sessionsModel = require('../../models/sessionsModel');
const jwt = require('jsonwebtoken');

describe("Authorization middlewares", () => {
    describe('#authenticateToken function', () => {

        afterEach(() => sinon.restore())

        it('should return status 401 if token is not present in Headers', function () {
            const response = {status: function () {return this}, send: function () {return this}};
            let setStatusSpy = sinon.spy(response, 'status');
            let sendSpy = sinon.spy(response, 'send');

            authorization.authenticateToken({headers: {authorization: null}}, response);
                    expect(setStatusSpy).to.have.been.calledWith(401);
                    expect(sendSpy).to.have.been.calledWith({error: 'Unauthorized'});
        });
        it('should return true if tokens match', function (done) {
            const response = {status: function () {return this}, send: function () {return this}};
            let setStatusSpy = sinon.spy(response, 'status');
            let sendSpy = sinon.spy(response, 'send');

            sinon.stub(usersModel, 'getUsersData').returns(Promise.resolve({users: [{name: "test", password: 12345}]}));
            sinon.stub(jwt, 'verify').callsFake((token, token2, cb) => {
                return cb()
            })

            authorization.authenticateToken({headers: {authorization: "Bearer test123"}}, response)
                .then(() => {
                    expect(setStatusSpy).to.have.been.calledWith(200);
                    done()
                })
                .catch(err => done(err))

        });
    });

    describe("#refreshToken function", () => {
        afterEach(() => sinon.restore())

        it('should return status 401 if refresh token was not sent', function (done) {
            sinon.stub(sessionsModel, 'getSessionData').returns(Promise.resolve({loggedUsers: [{accessToken: "test", refreshToken: 'test'}]}));

            const response = {status: function () {return this}, send: function () {return this}};
            let setStatusSpy = sinon.spy(response, 'status');
            let sendSpy = sinon.spy(response, 'send');

            authorization.refreshToken({body: {token: null}}, response)
                .then(() => {
                    expect(setStatusSpy).to.have.been.calledWith(401);
                    expect(sendSpy).to.have.been.calledWith({error: 'Unauthorized'});
                    done()
                })
                .catch(err => done(err))
        });

        it('should return status 403 if token is invalid', function (done) {
            sinon.stub(sessionsModel, 'getSessionData').returns(Promise.resolve({refreshTokens: ['notTest']}));

            const response = {status: function () {return this}, send: function () {return this}};
            let setStatusSpy = sinon.spy(response, 'status');
            let sendSpy = sinon.spy(response, 'send');

            authorization.refreshToken({body: {token: 'test'}}, response)
                .then(() => {
                    expect(setStatusSpy).to.have.been.calledWith(403);
                    expect(sendSpy).to.have.been.calledWith({error: 'Forbidden'});
                    done()
                })
                .catch(err => done(err))
        });

        it('should return status 201 if access token has been created successfully', function (done) {
            sinon.stub(sessionsModel, 'getSessionData').returns(Promise.resolve({refreshTokens: ['test']}));
            sinon.stub(jwt, 'sign').returns('test')
            sinon.stub(jwt, 'verify').callsFake((token, token2, cb) => {
                return cb(null, {name: "test"})
            });


            const response = {status: function () {return this}, send: function () {return this}};
            let setStatusSpy = sinon.spy(response, 'status');
            let sendSpy = sinon.spy(response, 'send');

            authorization.refreshToken({body: {token: 'test'}}, response)
                .then(() => {
                    expect(setStatusSpy).to.have.been.calledWith(201);
                    expect(sendSpy).to.have.been.calledWith({accessToken: 'test'});
                    done()
                })
                .catch(err => done(err))
        });
    })

    describe('#authRole function', () => {
        afterEach(() => sinon.restore())

        it('should return status 401 if login failed', function (done) {
            sinon.stub(usersModel, 'getUsersData').returns(Promise.resolve({users: [{name: "Yurii", password: 12345, role: 'admin', id: 2}]}));
            sinon.stub(sessionsModel, 'getSessionData').returns(Promise.resolve({loggedUsers: [{accessToken: 'notTest', userId: 2}]}));

            const response = {status: function () {return this}, send: function () {return this}};
            let setStatusSpy = sinon.spy(response, 'status');
            let sendSpy = sinon.spy(response, 'send');

            authorization.authRole({headers: {authorization: "Bearer test"}}, response, 'admin')
                .then(() => {
                    expect(setStatusSpy).to.have.been.calledWith(401);
                    done()
                })
                .catch((err) => done(err))
        });

        it('should return status 403 if user role does not match', function (done) {
            sinon.stub(usersModel, 'getUsersData').returns(Promise.resolve({users: [{name: "Yurii", password: 12345, role: 'user', id: 2}]}));
            sinon.stub(sessionsModel, 'getSessionData').returns(Promise.resolve({loggedUsers: [{accessToken: 'test', userId: 2}]}));

            const response = {status: function () {return this}, send: function () {return this}};
            let setStatusSpy = sinon.spy(response, 'status');

            authorization.authRole({headers: {authorization: "Bearer test"}}, response, 'admin')
                .then(() => {
                    expect(setStatusSpy).to.have.been.calledWith(403);
                    done()
                })
                .catch((err) => done(err))
        });
        it('should return next() if user role authentication succeed', function (done) {
            sinon.stub(usersModel, 'getUsersData').returns(Promise.resolve({users: [{name: "Yurii", password: 12345, role: 'admin', id: 2}]}));
            sinon.stub(sessionsModel, 'getSessionData').returns(Promise.resolve({loggedUsers: [{accessToken: 'test', userId: 2}]}));

            const response = {status: function () {return this}, send: function () {return this}};

            const resultMock = {status: 200, message: 'testResponse'};
            const next = () => resultMock;
            const nextSpy = sinon.spy(next);

            authorization.authRole({headers: {authorization: "Bearer test"}}, response, 'admin', nextSpy)
                .then((result) => {
                    expect(nextSpy).to.have.been.called;
                    expect(result).to.equal(resultMock);
                    done()
                })
                .catch((err) => done(err))
        });
    })
})