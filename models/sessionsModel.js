const fs = require('fs').promises;

const getSessionData = function () {
    return fs.readFile('./sessions/sessions.json', 'utf8')
        .then(res => JSON.parse(res))
        .catch((err) => {
            return console.log(err)
        });
}
exports.getSessionData = getSessionData;

const writeDataToSession = function (sessionData) {
    return fs.readFile('./sessions/sessions.json', 'utf8')
        .then(data => {
            let existingId = JSON.parse(data).loggedUsers.find(user => user.userId === sessionData.userId);
            if (data === false) {
                let sessionObj = {
                    loggedUsers: []
                };
                sessionObj.push(sessionData);
                let sessionJson = JSON.stringify(sessionObj, null, 2);
                return fs.writeFile('./sessions/sessions.json', sessionJson, 'utf8')
                    .then(result => JSON.parse(result))
                    .catch(err => console.log({error: err}))
            } else if (existingId) {
                existingId.accessToken = sessionData.accessToken;
                existingId.refreshToken = sessionData.refreshToken;
                let sessionObj = JSON.parse(data);
                sessionObj.loggedUsers.splice(existingId.userId, 1, existingId);
                let sessionJson = JSON.stringify(sessionObj,null, 2);
                return fs.writeFile('./sessions/sessions.json', sessionJson, 'utf8')
                    .then(() => ({message: `Already logged in!`,
                        accessToken: sessionData.accessToken, refreshToken: sessionData.refreshToken}))
                    .catch(err => ({error: err}))
            } else {
                let sessionObj = JSON.parse(data);
                sessionObj.loggedUsers.push(sessionData);
                let sessionJson = JSON.stringify(sessionObj, null, 2);
                return fs.writeFile('./sessions/sessions.json', sessionJson, 'utf8')
                    .then(() => ({message: `Successfully logged in`,
                        accessToken: sessionData.accessToken, refreshToken: sessionData.refreshToken}))
                    .catch(err => err)
            }
        })
}

exports.writeSession = function (res, accessToken, refreshToken, userId) {
    return getSessionData()
        .then(() => {
            let sessionData = {
                accessToken: accessToken,
                refreshToken: refreshToken,
                userId: userId
            };
            return writeDataToSession(sessionData, res, (err) => {
                if (err) {
                    console.log({error: err});
                }
            })
                .catch(err => err)
        })
}

exports.writeRefreshToken = function (refreshToken) {
    return fs.readFile('./sessions/sessions.json', 'utf8')
        .then(data => {
            let sessionObj = JSON.parse(data);
            if ( !sessionObj.refreshTokens) {
                sessionObj.refreshTokens = []
            };
            sessionObj.refreshTokens.push(refreshToken);
            return fs.writeFile('./sessions/sessions.json', JSON.stringify(sessionObj, null, 2), 'utf8')
                .then(() => ({refreshToken: refreshToken}))
                .catch(err => err)
        })
}

exports.deleteRefreshToken = function (req) {
    return getSessionData()
        .then(result => {
            result.refreshTokens.forEach(token => {
                if (token === req.body.token) {
                    result.refreshTokens.splice(result.refreshTokens.indexOf(token), 1);
                }
            })
            return fs.writeFile('./sessions/sessions.json', JSON.stringify(result, null, 2), 'utf8')
                .then(() => ({refreshToken: req.body.token}))
                .catch(err => err)
        })

}



