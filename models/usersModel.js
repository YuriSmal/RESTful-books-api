require('dotenv').config();
const booksApiHelper = require('../spec/helpers/booksApiHelper');
const fs = require('fs').promises;
const bcrypt = require('bcrypt');

const getUsersData = function () {
    return fs.readFile(booksApiHelper.setUsersEnv(), 'utf8')
        .then(res => JSON.parse(res))
        .catch((err) => {
            return console.log(err)
        });
}
exports.getUsersData = getUsersData;

const addUser = function (user) {
    return fs.readFile(booksApiHelper.setUsersEnv(), 'utf8')
        .then((data) => {
            if (data === false) {
                let usersObj = {
                    users: []
                }
                usersObj.users.push(user);
                let usersJson = JSON.stringify(usersObj, null, 2);
                return fs.writeFile(booksApiHelper.setUsersEnv(), usersJson, 'utf8')
                    .then(result => JSON.parse(result))
                    .catch(err => console.log({error: err}))
            } else {
                usersObj = JSON.parse(data);
                usersObj.users.push(user);
                usersJson = JSON.stringify(usersObj, null, 2);
                return fs.writeFile(booksApiHelper.setUsersEnv(), usersJson, 'utf8')
                    .then(res => res)
                    .catch(err => console.log({error: err}))
            }
        })
}
exports.addUser = addUser;

