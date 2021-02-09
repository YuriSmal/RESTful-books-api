const usersModel = require('../models/usersModel');
const validators = require('../validators/usersValidators');

exports.addUser = function addUser(req, res) {
    const name = req.body.name;
    const password = req.body.password;

    const validationResult = validators.validateUsersPostRequest(req);
    if (validationResult.isValid) {
        usersModel.postUsers(res, name, password)
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
        return usersModel.verifyUser(res, name, password)
            .then(result => res.send(result))
            .catch(err => res.status(400).send({error: err}))
    } else {
        return res.status(validationResult.status).send({error: validationResult.error})
    }
}

exports.tokenAuthentication = function tokenAuthentication(req, res, next) {
    return usersModel.authenticateToken(req, res, next)
        .then(() => next())
        .catch(err => res.send(err));
}

exports.refreshToken = function refreshToken(req, res) {
    return usersModel.refreshToken(req, res)
}

exports.userLogout = function userLogout(req, res) {
    return usersModel.deleteToken(req, res, result => {
        return res.send(result)
    })
}

