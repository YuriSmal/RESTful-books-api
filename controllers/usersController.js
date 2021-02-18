const authorization = require('../middlewares/authorization');
const validators = require('../validators/usersValidators');
const sessionModel = require('../models/sessionsModel');
const authorizationHelpers = require('../helpers/authorization');

exports.addUser = function addUser(req, res) {
    const name = req.body.name;
    const password = req.body.password;

    const validationResult = validators.validateUsersPostRequest(req);
    if (validationResult.isValid) {
        authorizationHelpers.postUsers(res, name, password)
            .then(user => res.send(user))
            .catch(err => res.send(err))
    } else {
        return res.status(validationResult.status).send({error: validationResult.error})
    }
}

exports.userLogin = function userLogin(req, res) {
    const name = req.body.name;
    const password = req.body.password;

    const validationResult = validators.validateUsersPostRequest(req);
    if (validationResult.isValid) {
        return authorizationHelpers.verifyUser(res, name, password)
            .catch(err => res.status(400).send({error: err}))
    } else {
        return res.status(validationResult.status).send({error: validationResult.error})
    }
}

exports.tokenAuthentication = function tokenAuthentication(req, res, next) {
    return authorization.authenticateToken(req, res, next)
        .then(() => next())
        .catch(err => res.send(err));
}

exports.refreshToken = function refreshToken(req, res) {
    return authorization.refreshToken(req, res)
}

exports.userLogout = function userLogout(req, res) {
    return sessionModel.deleteRefreshToken(req)
        .then(result => res.status(204).send(result))
        .catch(err => res.send(err))
}

exports.authRole = function authRole(role) {
    return (req, res, next) => {
        return authorization.authRole(req, res, role, next)
            .then((result) => (result))
            .catch(err => ({error: err}))
    }
}

