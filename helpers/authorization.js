const usersModel = require('../models/usersModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sessionsModel = require('../models/sessionsModel');

exports.verifyUser = function (res, name, password) {
    return usersModel.getUsersData()
        .then(users => {
            const user = users.users.find(user => user.name === name);
            if (user == null) {
                return res.status(400).send({error: "The user does not exist!"});
            }
            return bcrypt.compare(password, user.password)
                .then(result => {
                    if (result) {
                        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '10m'});
                        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
                        return sessionsModel.writeRefreshToken(refreshToken)
                            .then(() => {
                                return sessionsModel.writeSession(res, accessToken, refreshToken, user.id)
                                    .then((result) => res.status(201).send(result))
                            })
                    } else {
                        return res.status(400).send({error: "Incorrect password!"});
                    }
                })
        })
}

exports.postUsers = function (res, name, password) {
    return usersModel.getUsersData()
        .then((result) => {
            return bcrypt.hash(password, 10)
                .then((hashedPassword) => {
                    let id = result.users[result.users.length - 1].id;
                    let user = {
                        name: name,
                        password: hashedPassword,
                        id: ++id
                    };

                    if (name && password) {
                        return usersModel.addUser(user, (err) => {
                            if (err) {
                                console.log({error: err})
                            }
                        })
                            .then(() => res.status(202).send(user));
                    }
                })
        })
}
