require('dotenv').config();
const fs = require('fs').promises;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let refreshTokens = [];

const getUsersData = function () {
    return fs.readFile('/Users/ysmal/Desktop/ExpressBooksApp/database/users.json', 'utf8')
        .then(res => JSON.parse(res))
        .catch((err) => {
            return console.log(err)
        });
}

const addUser = function (user) {
    return fs.readFile('/Users/ysmal/Desktop/ExpressBooksApp/database/users.json', 'utf8')
        .then((data) => {
            if (data === false) {
                let usersObj = {
                    users: []
                }
                usersObj.users.push(user);
                let usersJson = JSON.stringify(usersObj, null, 2);
                return fs.writeFile('/Users/ysmal/Desktop/ExpressBooksApp/database/users.json', usersJson, 'utf8')
                    .then(result => JSON.parse(result))
                    .catch(err => console.log({error: err}))
            } else {
                usersObj = JSON.parse(data);
                usersObj.users.push(user);
                usersJson = JSON.stringify(usersObj, null, 2);
                return fs.writeFile('/Users/ysmal/Desktop/ExpressBooksApp/database/users.json', usersJson, 'utf8')
                    .then(res => res)
                    .catch(err => console.log({error: err}))
            }
        })
}

exports.postUsers = function (res, name, password) {
    return getUsersData()
        .then(() => {
           return bcrypt.hash(password, 10)
                .then((hashedPassword) => {
                    let user = {
                        name: name,
                        password: hashedPassword
                    };

                    if (name && password) {
                        return addUser(user, (err) => {
                            if (err) {
                                console.log({error: err})
                            }
                        })
                            .then(() => res.status(202).send(user));
                    } else {
                        res.status(422).send({error: "User not added!"})
                    }
                })

        })
}

exports.verifyUser = function (res, name, password) {
    return getUsersData()
        .then(users => {
            const user = users.users.find(user => user.name === name);
            if (user == null) {
                return res.status(400).send({error: "The user does not exist!"});
            }
            return bcrypt.compare(password, user.password)
                .then(result => {
                    if (result) {

                        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
                        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
                        refreshTokens.push(refreshToken);
                        return res.status(201).send({message: `Successfully logged in as ${user.name}`,
                            accessToken: accessToken, refreshToken: refreshToken});
                    } else {
                        return res.status(400).send({error: "Incorrect password!"});
                    }
                })
                .catch(err => res.status(400).send({error: err}))
        })
}

exports.authenticateToken = function (req, res) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    return getUsersData()
        .then(() => {
            return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
                if (err) return res.sendStatus(403);
            })
        })
}

exports.refreshToken = function (req, res, ) {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = jwt.sign({name: user.name}, process.env.ACCESS_TOKEN_SECRET);
        res.send({accessToken: accessToken})
    })
}

exports.deleteToken = function (req, res) {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    console.log(refreshTokens);
    return res.sendStatus(204);
}
