const usersModel = require('../models/usersModel');
const sessionsModel = require('../models/sessionsModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.authenticateToken = function (req, res) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.status(401).send({error: 'Unauthorized'});

    return usersModel.getUsersData()
        .then(() => {
            return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
                if (err) return res.status(403).send({error: 'Forbidden'})
                else  {return res.status(200)}
            })
        })
}

exports.refreshToken = function (req, res) {
    return sessionsModel.getSessionData()
        .then(result => {
            const refreshToken = req.body.token;
            if (refreshToken == null) return res.status(401).send({error: 'Unauthorized'});
            if (!result.refreshTokens.includes(refreshToken)) return res.status(403).send({error: 'Forbidden'});
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(403);
                const accessToken = jwt.sign({name: user.name}, process.env.ACCESS_TOKEN_SECRET);
                res.status(201).send({accessToken: accessToken})
            })
        })
}

exports.authRole = function (req, res, role, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    return usersModel.getUsersData()
        .then(users => {
            return sessionsModel.getSessionData()
                .then(sessionUsers => {
                    if (process.env.NODE_ENV === 'test') {

                    }
                    const loggedUser = sessionUsers.loggedUsers.find(user => user.accessToken === token);
                    if (!loggedUser) return res.status(401).send("Not logged in!");
                    const matchedUser = users.users.find(user => loggedUser.userId === user.id);
                    if (role !== matchedUser.role) {
                        return res.status(403).send("Not allowed!")
                    }
                    return next()
                })
        })
}